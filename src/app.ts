/* eslint-disable @typescript-eslint/dot-notation */
import { resumeConvertingJobs } from './queues/pdf2htmlQueue';
import conversionsRouter from './routes/conversions';
import pageRouter from './routes/page';
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
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import path from 'path';

const env = process.env.NODE_ENV || 'development',
  port = process.env.PORT;

export const isDev = env === 'development';

/** -- setup up swagger-jsdoc -- **/
const swaggerDefinition = {
    openapi: '3.0.1',
    info: {
      title: 'Pdf2Html Conversion Server',
      version: '1.0.0',
      description:
        'API of the Pdf2Html Conversion Server. Most of the endpoints need a Bearer Token in Authorization header.' +
        'You should use your username and password to login, and copy the accessToken to the Authorize. ' +
        'You should contact the Amdin to get a user account.',
      license: {
        name: 'GPLv3+',
        url: 'https://choosealicense.com/licenses/gpl-3.0/',
      },
    },
    host: `localhost:${port}`,
    basePath: '/',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  options = {
    swaggerDefinition,
    apis: [
      path.resolve(__dirname, 'swagger-jsdoc-shared-components.ts'),
      path.resolve(__dirname, 'app.ts'),
      path.resolve(__dirname, 'routes/users.ts'),
      path.resolve(__dirname, 'routes/conversions.ts'),
    ],
  },
  swaggerSpec = swaggerJSDoc(options);

/**  -- App -- **/
class App {
  public express: express.Express;

  constructor() {
    this.express = express();

    this.configure();
    this.mountRoutes();
    this.userHandlers();
    resumeConvertingJobs()
      .then((x: any) => {
        console.log('Done resuming jobs!');
      })
      .catch((error: any) => {
        console.log('Error on resuming job: ', error);
      });

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
    /** setup swagger-ui-express, must before use authenticate() **/
    this.express.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
      }),
    );
    // -- routes for docs and generated swagger spec --
    this.express.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
    // use JWT auth to secure the api
    this.express.use(authenticate());
    this.express.use(attachCurrentUser);

    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'ejs');
  }

  private mountRoutes() {
    this.express.use('/', pageRouter);
    this.express.use('/api/conversions', authorize([Role.Admin, Role.User]), conversionsRouter);
    this.express.use('/api/users', usersRouter);
    /**
     * @swagger
     * /api/login:
     *   post:
     *     summary: Log in
     *     description: Login to the application
     *     tags:
     *       - auth
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User for login.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginUser'
     *         application/x-www-form-urlencoded:
     *           schema:
     *             $ref: '#/components/schemas/LoginUser'
     *     responses:
     *       200:
     *         description: return token
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
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *                     asscessToken:
     *                       $ref: '#/components/schemas/Token'
     *                     refreshToken:
     *                       $ref: '#/components/schemas/Token'
     *
     */
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
    /**
     * @swagger
     *
     * /api/logout:
     *   post:
     *     summary: Log out
     *     description: logout the application, clear all refresh token which saved on server side. need Bearer Token in Authorization header
     *     tags:
     *       - auth
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: return logout result
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     */
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
    /**
     * @swagger
     *
     * /api/token:
     *   post:
     *     summary: Get a new accessToken by posting a valid refreshToken
     *     description: Get a new accessToken by posting a valid refreshToken
     *     tags:
     *       - auth
     *     consumes:
     *       - application/json
     *       - application/x-www-form-urlencoded
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: refreshToken
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 required: true
     *         application/x-www-form-urlencoded:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 required: true
     *     responses:
     *       200:
     *         description: return a new accessToken
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
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *                     asscessToken:
     *                       $ref: '#/components/schemas/Token'
     *                     refreshToken:
     *                       $ref: '#/components/schemas/Token'
     */
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
