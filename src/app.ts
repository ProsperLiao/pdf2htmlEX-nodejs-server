import indexRouter from './routes';
import conversionsRouter from './routes/conversions';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import logger from 'morgan';

import path from 'path';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();

    this.configure();
    this.mountRoutes();
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
    this.express.use(express['static'](path.join(__dirname, 'public')));
    this.express.use(logger('dev'));

    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'ejs');

    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      next(createError(404));
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.express.use((error: any, req: Request, res: Response, _next: NextFunction) => {
      // set locals, only providing error in development
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      res.locals.message = error.message;
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      res.locals.error = req.app.get('env') === 'development' ? error : {};
      // render the error page
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      res.status(error.status || 500);
      res.render('error');
    });
  }

  private mountRoutes() {
    this.express.use('/', indexRouter);
    this.express.use('/conversions', conversionsRouter);
  }
}

export default new App().express;
