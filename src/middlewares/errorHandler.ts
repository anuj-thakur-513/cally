import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ICustomError from "../types/ICustomError";

const errorHandler: ErrorRequestHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Server Error";
  err.statusCode = err.statusCode || 500;
  // logging for dev
  console.error(err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode,
  });
};

export default errorHandler;
