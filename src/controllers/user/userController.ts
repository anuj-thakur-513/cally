import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../core/AppError";
import verifyGoogleToken from "../../utils/verifyGoogleToken";
import generateToken from "../../utils/generateToken";
import ApiResponse from "../../core/ApiResponse";
import { AUTH_COOKIE_OPTIONS } from "../../config/cookiesConfig";
import Db from "../../services/Db";

const prisma = Db.getPrismaClient();

const handleGoogleAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { credential } = req.body;
  if (!credential) {
    return next(new AppError(400, "Google credential is required"));
  }

  const verificationResponse = await verifyGoogleToken(credential);
  if (verificationResponse.error) {
    return next(new AppError(400, verificationResponse.error));
  }

  const profile = verificationResponse?.payload;
  if (!profile) {
    return next(new AppError(404, "Profile not found"));
  }
  let user = await prisma.user.findUnique({
    where: {
      email: profile.email,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email as string,
        googleId: profile.sub,
        name: profile.name as string,
        profilePicture: profile.picture as string,
      },
    });
  }
  const accessToken = generateToken(user.id, user.email);
  res
    .status(200)
    .cookie("accessToken", accessToken, AUTH_COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        {
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
        },
        "OAuth successful"
      )
    );
});

const handleAuthCheck = async (req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(
      {
        isAuthenticated: true,
      },
      "Authenticated"
    )
  );
};

export { handleGoogleAuth, handleAuthCheck };
