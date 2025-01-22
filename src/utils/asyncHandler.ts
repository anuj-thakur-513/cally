import { NextFunction, Request, Response } from "express";
import AsyncFunction from "../types/AsyncFunction";

function asyncHandler(asyncFunction: AsyncFunction) {
  return function (req: Request, res: Response, next: NextFunction) {
    asyncFunction(req, res, next).catch(next);
  };
}

export default asyncHandler;
