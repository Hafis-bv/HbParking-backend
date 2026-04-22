"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateTokenAndSetCookies_1 = require("../utils/generateTokenAndSetCookies");
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new AppError_1.AppError("All fields are required", 400));
    }
    const existingUser = await prisma_1.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new AppError_1.AppError("User alredy exists", 400));
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await prisma_1.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        placeNumber: true,
      },
    });
    (0, generateTokenAndSetCookies_1.generateTokenAndSetCookies)(
      res,
      newUser.id,
    );
    return res.json({ message: "User successfully registered!", newUser });
  } catch (err) {
    console.error(err);
    return next(new AppError_1.AppError("Internal Server Error", 500));
  }
}
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError_1.AppError("All fields are required", 400));
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError_1.AppError("Invalid credentials", 400));
    }
    const isPasswordValid = await bcryptjs_1.default.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return next(new AppError_1.AppError("Invalid credentials", 400));
    }
    const token = (0, generateTokenAndSetCookies_1.generateTokenAndSetCookies)(
      res,
      user.id,
    );
    return res.json({
      message: "Login successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return next(new AppError_1.AppError("Internal Server Error", 500));
  }
}
async function logout(req, res, next) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Logged out successfully" });
}
