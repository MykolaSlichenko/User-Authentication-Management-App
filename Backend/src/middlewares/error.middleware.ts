import { Request, Response, NextFunction } from "express";
import { AppError, isAppError } from "../utils/app-error";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  if (isAppError(error)) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: status >= 500 ? "error" : "fail",
      message: error.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: error?.message || "Internal server error",
  });
};