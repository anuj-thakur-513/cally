import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../core/AppError";
import keys from "../config/keys";
import Db from "../services/Db";
import { refreshGoogleTokens, isGoogleAccessTokenValid } from "../utils/googleOAuth";
import { AUTH_COOKIE_OPTIONS } from "../config/cookiesConfig";

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
      googleRefreshToken: true,
    },
  });

  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }

  let googleAccessToken = req.cookies?.googleToken || req.header("Google-Token")?.split(" ")[1];
  const isGoogleTokenValid = await isGoogleAccessTokenValid(googleAccessToken);
  if (!isGoogleTokenValid) {
    googleAccessToken = await refreshGoogleTokens(user.googleRefreshToken);
    if (googleAccessToken) {
      res.cookie("googleToken", googleAccessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
      });
    }
  }

  req.user = { ...user, googleAccessToken };
  next();
});

export default verifyToken;
