import { Request } from "express";
import { IUser } from "./IUser";
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
