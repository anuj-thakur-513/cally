import { NextFunction, Request, Response } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default AsyncFunction;
