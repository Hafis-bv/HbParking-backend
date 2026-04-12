import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

export async function getAllZones(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const zones = await prisma.zone.findMany();

    return res.json(zones);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function createZone(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, pricePerHour, maxCapacity, address } = req.body;

  if (!name || !pricePerHour || !maxCapacity || !address) {
    return next(new AppError("All fields are required", 400));
  }
  try {
    const zone = await prisma.zone.create({
      data: {
        name,
        pricePerHour,
        maxCapacity,
        address,
      },
    });

    return res.json({ message: "Zone successfully created!", zone });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function deleteZone(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(new AppError("Valid id is required", 400));
  }
  try {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      return next(new AppError("Zone not found", 404));
    }
    await prisma.zone.delete({ where: { id } });

    return res.json({ message: "Zone successfully deleted", zone });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function updateZone(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const { name, pricePerHour, maxCapacity, address } = req.body;
  if (!id || Array.isArray(id)) {
    return next(new AppError("Valid id is required", 400));
  }
  try {
    const zone = await prisma.zone.update({
      where: { id },
      data: {
        name,
        pricePerHour,
        maxCapacity,
        address,
      },
    });
    if (!zone) {
      return next(new AppError("Zone not found", 404));
    }

    return res.json({ message: "Zone updated successfully", zone });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function getZoneById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return next(new AppError("Valid id is required", 400));
  }

  try {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      return next(new AppError("Zone not found", 404));
    }

    return res.json(zone);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
