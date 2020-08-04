import indexRouter from './routes';
import conversionsRouter from './routes/conversions';
import usersRouter from './routes/users';
import errorHandler from './utils/error-handler';
import responseHandler from './utils/response-handler';
import { cleanTasks } from './utils/util';

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

    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'ejs');
  }

  private mountRoutes() {
    this.express.use('/', indexRouter);
    this.express.use('/api/conversions', conversionsRouter);
    this.express.use('/api/users', usersRouter);
  }

  private userHandlers() {
    // global response handler
    this.express.use(responseHandler);
    // global error handler
    this.express.use(errorHandler);
  }
}

export default new App().express;
