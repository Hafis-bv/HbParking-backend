import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next(new AppError("Not authorized, no token found", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = decoded as JwtPayload;

    if (!userId) {
      return next(new AppError("Not authorized, invalid token", 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
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
