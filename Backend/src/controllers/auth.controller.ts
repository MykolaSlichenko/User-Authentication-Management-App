import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  try {
    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json(result);
  } catch (error: any) {
    return next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await authService.refreshAccessToken(
        req.body.refreshToken
      );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.logoutUser(
      req.body.refreshToken
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error: any) {
    return next(error);
  }
};
