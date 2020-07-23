import indexRouter from './routes';
import conversionsRouter from './routes/conversions';
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
    this.afterMountRoutes();

    // schedule to delete old tasks to save disk storage， every day a 2:30 am
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
    this.express.use('/api', conversionsRouter);
  }

  private afterMountRoutes() {
    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      next(createError(404, 'not found!'));
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.express.use((error: any, req: Request, res: Response, _next: NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = error.message;
      res.locals.error = req.app.get('env') === 'development' ? error : {};
      res.status(error.status || 500);
      if (req.path.indexOf('api') !== -1) {
        res.json(error);
      } else {
        res.render('index', { page: 'error', url: req.url, errno: error.status || 500, errmsg: error.message });
      }
    });
  }
}

export default new App().express;
