import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

// global response handler
/**
 * @param req
 * @param res
 * @param next
 */
function responseHandler(req: Request, res: Response, next: NextFunction) {
  if (!res.data) {
    return next(createError(404, 'Invalid Endpoint'));
  }
  return res.status(res.statusCode || 200).send(res.data);
}

export default responseHandler;
