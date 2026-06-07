import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../interfaces";
import AppError from "../errors/AppError";

// Type Guard
const isJwtPayload = (payload: unknown): payload is JwtPayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "email" in payload &&
    "name" in payload
  );
};

// Protect Middleware
const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isJwtPayload(decoded)) {
      return next(new AppError("Unauthorized: Invalid token", 401));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401),
    );
  }
};

export default protect;
