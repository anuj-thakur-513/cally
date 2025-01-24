import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../core/AppError";
import { generateAuthUrl, verifyGoogleToken } from "../../utils/googleOAuth";
import generateToken from "../../utils/generateToken";
import ApiResponse from "../../core/ApiResponse";
import { AUTH_COOKIE_OPTIONS } from "../../config/cookiesConfig";
import Db from "../../services/Db";

const prisma = Db.getPrismaClient();

const handleGoogleAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authUrl = generateAuthUrl();
  res.status(200).json(new ApiResponse(authUrl, "OK"));
});

const handleGoogleRedirect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    if (!code) throw new Error("Authorization code missing");

    const { userInfo, googleAccessToken, googleRefreshToken } = await verifyGoogleToken(
      code as string
    );
    if (!userInfo || !googleAccessToken || !googleRefreshToken) {
      throw new Error("Unable to fetch user profile");
    }

    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (user) {
      await prisma.user.update({
        where: {
          email: userInfo.email as string,
        },
        data: {
          googleRefreshToken: googleRefreshToken as string,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: userInfo.email as string,
          googleId: userInfo.id as string,
          googleRefreshToken: googleRefreshToken,
          name: userInfo.name,
          profilePicture: userInfo.picture as string,
        },
      });
    }

    const accessToken = generateToken(user.id, user.email);

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie("googleToken", googleAccessToken, { ...AUTH_COOKIE_OPTIONS, maxAge: 60 * 60 * 1000 })
      .json(
        new ApiResponse(
          {
            user: {
              email: user.email,
              name: user.name,
              profilePicture: user.profilePicture,
              id: user.id,
              googleId: user.googleId,
            },
          },
          "User authenticated succesfully"
        )
      );
  }
);

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

const handleLogout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("googleToken")
    .json(new ApiResponse(null, "Logged out"));
};

export { handleGoogleAuth, handleGoogleRedirect, handleAuthCheck, handleLogout };
