import { NextFunction, Request, Response } from 'express';

/**
 * @param error
 * @param req
 * @param res
 * @param next
 */
function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  if (req.path.indexOf('api') === -1) {
    return res.render('index', {
      page: 'error',
      url: req.url,
      errno: error.status || 500,
      errmsg: typeof error === 'string' ? error : error.message,
    });
  }

  if (typeof error === 'string') {
    // custom application error
    return res.status(400).json({ success: false, error });
  }

  if (error.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ success: false, error });
  }

  // default to 500 server error
  return res.status(error.statusCode || 500).json({ success: false, error });
}

export default errorHandler;
