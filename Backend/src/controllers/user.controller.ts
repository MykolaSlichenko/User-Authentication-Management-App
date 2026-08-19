import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error: any) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  try {
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return next(error);
  }
};
