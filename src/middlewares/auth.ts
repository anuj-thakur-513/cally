import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../core/AppError";
import keys from "../config/keys";
import Db from "../services/Db";

const prisma = Db.getPrismaClient();

const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return next(new AppError(401, "Unauthorized"));
  }

  const decoded = jwt.verify(token, keys.jwt.secret as string) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      googleId: true,
    },
  });

  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }

  req.user = user;
  next();
});

export default verifyToken;
