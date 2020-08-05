import indexRouter from './routes';
import conversionsRouter from './routes/conversions';
import usersRouter from './routes/users';
import {
  authenticate,
  authorize,
  attachCurrentUser,
  cleanTasks,
  login,
  logout,
  doRefreshToken,
  errorHandler,
  responseHandler,
  Role,
} from './utils';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import logger from 'morgan';
import cron from 'node-cron';

import path from 'path';

const env = process.env.NODE_ENV || 'development';

export const isDev = env === 'development';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();

    this.configure();
    this.mountRoutes();
    this.userHandlers();

    // schedule to delete old tasks to save disk storage， every day at 2:30 am
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cron.schedule('* 30 2 * * *', async () => {
      console.log('[***] running scheduler at 2:30 AM every day, to delete all the tasks exceeds 2 days.');
      await cleanTasks();
    });
  }

  /**
   * App Configuration
   *
   */
  private configure() {
    // middleware
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cookieParser());
    this.express.use('/public', express['static'](path.resolve(__dirname, isDev ? '../public' : './public')));
    this.express.use(express['static'](path.resolve(__dirname, isDev ? '../public/assets' : './public/assets')));
    this.express.use(logger('dev'));
    // use JWT auth to secure the api
    this.express.use(authenticate());
    this.express.use(attachCurrentUser);

    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'ejs');
  }

  private mountRoutes() {
    this.express.use('/', indexRouter);
    this.express.use('/api/conversions', authorize([Role.Admin, Role.User]), conversionsRouter);
    this.express.use('/api/users', usersRouter);
    this.express.post('/api/login', async (req, res, next) => {
      try {
        const result = await login(req.body);
        res.status(200);
        res.data = { success: true, message: 'Login successfully.', data: result };
        return next();
      } catch (error) {
        return next(createError(500, error.message));
      }
    });
    this.express.post('/api/logout', authorize([Role.Admin, Role.User]), async (req, res, next) => {
      try {
        await logout(req.currentUser.id);
        res.status(200);
        res.data = { success: true, message: 'Logout successfully.' };
        return next();
      } catch (error) {
        return next(createError(500, error.message));
      }
    });
    // refresh accessToken with a valid refreshToken
    this.express.post('/api/token', async (req, res, next) => {
      try {
        const result = await doRefreshToken(req.body);
        res.status(200);
        res.data = { success: true, message: 'Refresh token successfully.', data: result };
        return next();
      } catch (error) {
        return next(createError(500, error.message));
      }
    });
  }

  private userHandlers() {
    // global response handler
    this.express.use(responseHandler);
    // global error handler
    this.express.use(errorHandler);
  }
}

export default new App().express;
