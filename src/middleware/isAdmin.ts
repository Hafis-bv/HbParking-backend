import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.user?.role;

  if (!role) {
    return next(new AppError("Unauthorized", 401));
  }

  if (role !== "ADMIN") {
    return next(new AppError("Access denied. Admins only.", 403));
  }

  next();
}
