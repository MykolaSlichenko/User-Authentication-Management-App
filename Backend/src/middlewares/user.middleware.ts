import { NextFunction, Response } from "express";
import prisma from "../config/prisma";
import { AppError } from "../utils/app-error";
import { AuthRequest } from "./auth.middleware";

export const userMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        acceptedTerms: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = {
      ...req.user,
      ...user,
    };

    return next();
  } catch (error: any) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Unauthorized", 401)
    );
  }
};
