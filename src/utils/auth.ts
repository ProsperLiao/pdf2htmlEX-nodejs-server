/* eslint-disable @typescript-eslint/no-unsafe-return */
import Role from './role';

import models from '../models';

import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import expressJwt from 'express-jwt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

const Joi = require('joi');

const excludedUrls = [
    // public routes that don't require authentication
    '/',
    '/users',
    '/doc',
    '/login',
    '/api/login',
    '/api/token',
  ],
  accessTokenExpiresIn = '7d',
  refreshTokenExpiresIn = '30d';

/**
 * @param user
 */
function validateUser(user: any) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(255).required(),
    desc: Joi.string().allow('', null),
    role: Joi.string().valid('Admin', 'User').allow('', null),
  });
  return schema.validate(user);
}

/**
 * @param user
 */
export function omitPassword(user: any) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 *
 */
function authenticate() {
  const secret = process.env.JWT_TOKEN_SECRET || '';
  // authenticate JWT token and attach token to request object (req.token)
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    userProperty: 'token', // this is where the next middleware can find the encoded data generated in api/users/login -> 'req.token'
    getToken(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      return undefined;
    }, // A function to get the auth token from the request
  }).unless({
    path: excludedUrls,
  });
}

/**
 * @param req
 * @param res
 * @param next
 */
async function attachCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (excludedUrls.indexOf(req.url) > -1) {
      return next();
    }
    const { token } = req,
      user = await models.User.findOne({ raw: true, where: { id: token.sub } });
    req.currentUser = omitPassword(user);

    if (!user) {
      return res.status(401).end('User not found, Please login again.');
    }
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * @param roles
 */
function authorize(roles: string | string[] = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  let rolesArr: string[];
  if (typeof roles === 'string') {
    rolesArr = [roles];
  } else {
    rolesArr = [...roles];
  }
  // authorize based on user role
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || (rolesArr.length && !rolesArr.includes(req.currentUser.role))) {
      // user's role is not authorized
      throw createError(401, 'Unauthorized');
    }

    // authorization successful
    return next();
  };
}

/**
 * @param userx
 * @param userx.username
 * @param userx.password
 */
async function login(userx: { username: string; password: string }) {
  const { error } = validateUser(userx);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const user = await models.User.findOne({
    raw: true,
    where: { username: userx.username },
  });
  if (!user) {
    throw new Error('Username is incorrect.');
  }
  const passwordIsValid = bcrypt.compareSync(userx.password, user.password);
  if (!passwordIsValid) {
    throw new Error('Password is incorrect.');
  }
  const accessToken = jwt.sign(
      { sub: user.id, username: user.username, desc: user.desc, role: user.role },
      process.env.JWT_TOKEN_SECRET || '',
      { expiresIn: accessTokenExpiresIn },
    ),
    refreshToken = jwt.sign(
      { sub: user.id, username: user.username, desc: user.desc, role: user.role },
      process.env.JWT_REFRESH_TOKEN_SECRET || '',
      { expiresIn: refreshTokenExpiresIn },
    );
  await models.RefreshToken.create({ username: user.username, userid: user.id, refreshToken }, { raw: true });
  return {
    user: omitPassword(user),
    accessToken: { token: accessToken, expiresIn: accessTokenExpiresIn },
    refreshToken: { token: refreshToken, expiresIn: refreshTokenExpiresIn },
  };
}

/**
 * @param userid
 */
async function logout(userid: number) {
  await models.RefreshToken.destroy({ where: { userid } });
}

/**
 * @param userx
 * @param userx.username
 * @param userx.password
 * @param userx.desc
 * @param userx.role
 */
async function register(userx: { username: string; password: string; desc?: string; role?: string }) {
  const { error } = validateUser(userx);
  if (error) {
    throw new Error(error.details[0].message);
  }
  let user = await models.User.findOne({
    where: { username: userx.username },
  });
  if (user) {
    throw new Error('User already registered');
  }
  const pwd = await bcrypt.hash(userx.password, 10);
  user = await models.User.create(
    { username: userx.username, password: pwd, desc: userx.desc, role: userx.role || Role.User },
    { raw: true },
  );

  return user;
}

/**
 * @param root0
 * @param root0.refreshToken
 */
async function doRefreshToken({ refreshToken: refToken }: { refreshToken: string }) {
  if (!refToken) {
    throw createError(401, 'refreshToken is not exist.');
  }
  const { refreshToken } = await models.RefreshToken.findOne({ where: { refreshToken: refToken } });
  if (!refreshToken) {
    throw createError(403, 'refreshToken is invalid.');
  }

  const token: any = jwt.verify(refToken, process.env.JWT_REFRESH_TOKEN_SECRET || '');
  if (!token) {
    throw createError(403, 'refreshToken is invalid.');
  }
  const user = await models.User.findOne({ raw: true, where: { id: token.sub } });
  if (!user) {
    throw createError(401, 'User not found, Please login again.');
  }
  const accessToken = jwt.sign(
    { sub: user.id, username: user.username, desc: user.desc, role: user.role },
    process.env.JWT_TOKEN_SECRET || '',
    { expiresIn: accessTokenExpiresIn },
  );

  return {
    user: omitPassword(user),
    accessToken: { token: accessToken, expiresIn: accessTokenExpiresIn },
    refreshToken: { token: refreshToken, expiresIn: refreshTokenExpiresIn },
  };
}

export { attachCurrentUser, authorize, authenticate, login, logout, register, doRefreshToken };
