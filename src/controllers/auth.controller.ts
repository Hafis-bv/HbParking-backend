import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";
import { sendEmail } from "../utils/sendEmail";
import { generateRegisterHtmll } from "../utils/generateRegisterHtmll";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError("User alredy exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    generateTokenAndSetCookies(res, newUser.id);

    const html = generateRegisterHtmll(email);
    sendEmail(email, "Register", html);

    return res
      .status(201)
      .json({ message: "User successfully registered!", newUser });
  } catch (err) {
    console.error(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError("Invalid credentials", 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid credentials", 400));
    }

    const token = generateTokenAndSetCookies(res, user.id);

    return res.status(200).json({
      message: "Login successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Logged out successfully" });
}
