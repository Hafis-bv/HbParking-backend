import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";
import { sendEmail } from "../utils/sendEmail";
import { generateRegisterHtmll } from "../utils/generateRegisterHtmll";
import admin from "../lib/firebaseAdmin";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.body;
    if (!token) {
      return next(new AppError("Token is required", 401));
    }

    const { uid, email } = await admin.auth().verifyIdToken(token);

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { id: uid } });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const user = await prisma.user.create({
      data: {
        id: uid,
        email,
      },
    });

    const html = generateRegisterHtmll(email);
    sendEmail(email, "Register", html);

    return res
      .status(201)
      .json({ message: "User successfully registered!", user });
  } catch (err) {
    console.error(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;
  if (!token) {
    return next(new AppError("Token is required", 401));
  }

  try {
    const { uid } = await admin.auth().verifyIdToken(token);
    await admin.auth().revokeRefreshTokens(uid);
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Token is required", 401));
  }
  try {
    const { uid } = await admin.auth().verifyIdToken(token);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
