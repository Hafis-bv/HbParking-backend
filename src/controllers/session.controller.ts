import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

export async function startSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { zoneId } = req.body;

  if (!userId || !zoneId) {
    return next(new AppError("userId and zoneId are required", 400));
  }

  try {
    const existingSession = await prisma.session.findFirst({
      where: { id: userId, endTime: null },
    });
    if (existingSession) {
      return next(new AppError("You alredy have an active session", 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return next(new AppError("User not found", 400));
    }

    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });
    if (!zone) {
      return next(new AppError("Zone not found", 400));
    }

    const session = await prisma.session.create({
      data: {
        userId,
        zoneId,
      },
      include: { zone: true, user: true },
    });

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      session,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function endSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sessionId } = req.params;

  if (!sessionId || Array.isArray(sessionId)) {
    return next(new AppError("Session id is required", 400));
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { zone: true, user: true },
    });

    if (!session) {
      return next(new AppError("Session not found", 400));
    }

    if (session.endTime) {
      return next(new AppError("Session already ended", 400));
    }

    const endTime = new Date();

    const durationMinutes =
      (endTime.getTime() - session.startTime.getTime()) / (1000 * 60);

    let totalCost = 0;

    if (durationMinutes > 15) {
      const paidMinutes = durationMinutes - 15;

      const hours = Math.ceil(paidMinutes / 60);

      totalCost = hours * session.zone.pricePerHour;
    }

    if (session.user.balance < totalCost) {
      return next(new AppError("Insufficient balance", 400));
    }

    const updatedSession = await prisma.$transaction(async (tx) => {
      const updated = await tx.session.update({
        where: { id: sessionId },
        data: {
          endTime,
          totalCost,
        },
      });

      await tx.user.update({
        where: { id: session.userId },
        data: {
          balance: { decrement: totalCost },
        },
      });

      return updated;
    });

    return res.json({
      message: "Session ended",
      totalCost,
      data: updatedSession,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    const session = await prisma.session.findFirst({
      where: { userId, endTime: null },
      include: { zone: true },
    });

    return res.json(session);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
