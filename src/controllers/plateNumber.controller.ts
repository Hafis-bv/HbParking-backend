import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

export async function createPlateNumber(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { plateNumber } = req.body;

  if (!userId) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!plateNumber) {
    return next(new AppError("Plate number is required", 400));
  }

  try {
    const normalizedPlate = plateNumber.trim().toUpperCase();

    if (!normalizedPlate) {
      return next(new AppError("Plate number cannot be empty", 400));
    }

    const existing = await prisma.plateNumber.findUnique({
      where: {
        plate: normalizedPlate,
      },
    });

    if (existing) {
      return next(new AppError("Plate number already exists", 400));
    }

    const newPlate = await prisma.plateNumber.create({
      data: {
        plate: normalizedPlate,
        userId,
      },
    });

    return res.json({
      success: true,
      message: "Plate number created",
      data: newPlate,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function deletePlateNumber(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { plateNumberId } = req.params;
  const userId = req.user?.id;

  if (!plateNumberId || Array.isArray(plateNumberId)) {
    return next(new AppError("Plate id is required", 400));
  }
  try {
    const plateNumber = await prisma.plateNumber.findFirst({
      where: {
        id: plateNumberId,
        userId,
      },
    });

    if (!plateNumber) {
      return next(new AppError("Plate not found", 404));
    }

    const deletePlate = await prisma.plateNumber.delete({
      where: { id: plateNumberId },
    });

    res.json({
      message: "Plate number deleted successfully",
      deletePlate,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export const getMyPlateNumbers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError("User not authorized", 401));
  }
  try {
    const plateNumbers = await prisma.plateNumber.findMany({
      where: { userId },
    });

    return res.json({
      success: true,
      plateNumbers,
    });
  } catch (err) {
    console.log(err);

    return next(new AppError("Internal Server Error", 500));
  }
};
