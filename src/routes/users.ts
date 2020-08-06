import models from '../models';
import { Role } from '../utils';
import { register, omitPassword, authorize } from '../utils/auth';

import bcrypt from 'bcrypt';
import express from 'express';
import createError from 'http-errors';

const Joi = require('joi');

const router = express.Router();

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
      data: user.dataValues,
    };
    return next();
  } catch (error) {
    return next(createError(400, error.message));
  }
});

export = router;
