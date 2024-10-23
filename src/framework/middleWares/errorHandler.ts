import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/customError';


export const errorHandler: ErrorRequestHandler = (
  err: Error & Partial<CustomError>,
  req: Request,
  res: Response,
  next: NextFunction
): void => {  
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeError() });
    return;
  }

  console.error(err);

  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
