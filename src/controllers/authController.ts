import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import AppError from "../errors/AppError";
import {
  TypedRequest,
  RegisterBody,
  LoginBody,
  ApiResponse,
  JwtPayload,
} from "../interfaces";

//  Helper: Generate JWT Token  We reuse this in both register and login
const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

//  POST /api/auth/register
export const register = async (
  req: TypedRequest<RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already registered. Please login.", 400));
    }

    // 2. Create user — password gets hashed automatically by our pre-save hook
    const user = await User.create({ name, email, password });

    // 3. Generate JWT token for the new user
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    const token = generateToken(payload);

    // 4. Send response — notice we never send the password back
    const response: ApiResponse<{ id: string; name: string; email: string }> = {
      success: true,
      message: "Registration successful",
      token, // User saves this token for future requests
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

//  POST /api/auth/login
export const login = async (
  req: TypedRequest<LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email — we use .select("+password")
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Use vague message — don't tell attacker if email exists or not
      return next(new AppError("Invalid email or password", 401));
    }

    // 2. Compare entered password with hashed password in database
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password", 401));
    }

    // 3. Generate token for the logged-in user
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    const token = generateToken(payload);

    // 4. Send token back — user copies this for protected requests
    const response: ApiResponse<{ id: string; name: string; email: string }> = {
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
