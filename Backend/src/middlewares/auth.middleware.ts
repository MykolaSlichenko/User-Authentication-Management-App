import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload & {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    acceptedTerms?: boolean;
    createdAt?: Date | string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError("Invalid token format", 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error: any) {
    return next(new AppError("Unauthorized", 401));
  }
};