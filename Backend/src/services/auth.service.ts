import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import { AppError } from "../utils/app-error";
import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptedTerms?: boolean;
}) => {
  const { email, password, firstName, lastName, acceptedTerms } = data;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400
    );
  }

  if (!firstName || !lastName) {
    throw new AppError(
      "First name and last name are required",
      400
    );
  }

  if (acceptedTerms !== true) {
    throw new AppError(
      "You must accept the terms and conditions",
      400
    );
  }

  if (!validateEmail(email)) {
    throw new AppError(
      "Invalid email format",
      400
    );
  }

  if (!validatePassword(password)) {
    throw new AppError(
      "Password must be at least 6 characters",
      400
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existingUser) {
    throw new AppError(
      "User already exists",
      409
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      acceptedTerms: acceptedTerms === true,
    },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    acceptedTerms: user.acceptedTerms,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400
    );
  }

  if (!validateEmail(email)) {
    throw new AppError(
      "Invalid email format",
      400
    );
  }

  const user =
    await prisma.user.findUnique({
      where: { email },
    });

  if (!user) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      jti: randomUUID(),
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      jti: randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  });

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token required",
      401
    );
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as {
    userId: string;
  };

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Invalid refresh token",
      401
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      jti: randomUUID(),
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  return {
    accessToken,
  };
};

export const logoutUser = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token required",
      400
    );
  }

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Invalid refresh token",
      401
    );
  }

  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });

  return {
    message: "Logout successful",
  };
};


