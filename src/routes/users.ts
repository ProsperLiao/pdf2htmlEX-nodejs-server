import models from '../models';
import { Role } from '../utils';
import { register, omitPassword, authorize } from '../utils/auth';

import bcrypt from 'bcrypt';
import express from 'express';
import createError from 'http-errors';

const Joi = require('joi');

const router = express.Router();

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     summary: Get users list
 *     description: Get users list of those users you have authorization, need Bearer Token in the Authorization header.
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', authorize([Role.Admin, Role.User]), async (req, res, next) => {
  try {
    let users: any;
    if (req.currentUser.role === Role.Admin) {
      users = await models.User.findAll({ raw: true });
    } else {
      users = await models.User.findAll({ raw: true, where: { id: req.currentUser.id } });
    }
    res.data = { success: true, data: users.map(omitPassword) };
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
});

/**
 * @swagger
 *
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user
 *     description: Get a specific user when you have authorization, need Bearer Token in the Authorization header.
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: return a specific user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/:id', authorize([Role.Admin, Role.User]), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.currentUser.role !== Role.Admin && req.currentUser.id !== id) {
      return next(createError(401, 'Unauthorized'));
    }
    const user = await models.User.findOne({
      raw: true,
      where: { id },
    });
    if (!user) {
      return next(createError(404, `User with id ${id} is not exist`));
    }
    res.data = { success: true, data: omitPassword(user) };
    return next();
  } catch (error) {
    return next(createError(400, error.message));
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: create a new user
 *     tags:
 *       - users
 *     consumes:
 *       - application/json
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: return the user created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *
 */
router.post('/', authorize(Role.Admin), async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201);
    res.data = { success: true, message: 'User created.', data: omitPassword(user.dataValues) };
    return next();
  } catch (error) {
    return next(createError(400, error.message));
  }
});

/**
 * @swagger
 * /api/users/{id}/password:
 *   put:
 *     summary: change a specific user's password
 *     description: change a specific user's password
 *     tags:
 *       - users
 *     consumes:
 *       - application/json
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: the user ID
 *     requestBody:
 *       description: old_password and new_password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *             require:
 *               - old_password
 *               - new_password
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *             required:
 *               - old_password
 *               - new_password
 *     responses:
 *       200:
 *         description: return the user just changed password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *
 */
router.put('/:id/password', authorize([Role.Admin, Role.User]), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.currentUser.role !== Role.Admin && req.currentUser.id !== id) {
      return next(createError(401, 'Unauthorized'));
    }
    const user = await models.User.findOne({
      raw: true,
      where: { id },
    });
    if (!user) {
      return next(createError(404, `User with id ${id} is not exist`));
    }
    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().min(3).max(255).required(),
      }),
      { error } = schema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { old_password: oldPwd, new_password: newPwd } = req.body,
      passwordIsValid = bcrypt.compareSync(oldPwd, user.password);
    if (!passwordIsValid) {
      throw new Error('Old password is incorrect.');
    }
    await models.User.update({ password: await bcrypt.hash(newPwd, 10) }, { where: { id } });
    res.status(200);
    res.data = { success: true, message: 'Password changed successfully.', data: omitPassword(user) };
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
});

/**
 * @swagger
 *
 * /api/users/{id}:
 *   delete:
 *     summary: delete a specific user
 *     description: delete a specific user when you have authorization, need Bearer Token in the Authorization header.
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: return a specific user just deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router['delete']('/:id', authorize([Role.Admin, Role.User]), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.currentUser.role !== Role.Admin && req.currentUser.id !== id) {
      return next(createError(401, 'Unauthorized'));
    }
    const user = await models.User.findOne({
      where: { id },
    });
    if (!user) {
      res.status(404);
      res.data = { success: false, message: `user with this id ${id} not exist` };
      return next();
    }
    await user.destroy();
    res.data = {
      success: true,
      message: 'Delete Successfully!',
      data: omitPassword(user.dataValues),
    };
    return next();
  } catch (error) {
    return next(createError(400, error.message));
  }
});

export = router;
