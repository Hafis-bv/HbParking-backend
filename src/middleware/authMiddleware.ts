import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import admin from "../lib/firebaseAdmin";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError("Not authorized, no token found", 401));
    }

    const { uid } = await admin.auth().verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        email: true,
        plateNumbers: true,
        balance: true,
        role: true,
        sessions: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return next(new AppError("Not authorized", 401));
  }
}
