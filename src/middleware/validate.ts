import { Response, NextFunction } from "express";
import { TypedRequest } from "../interfaces";
import AppError from "../errors/AppError";

const VALID_CATEGORIES = [
  "work",
  "personal",
  "study",
  "health",
  "finance",
  "other",
];

// ─── Existing validators (keep these) ─────────────────────────────────────
export const validateCreateNote = <
  T extends {
    title?: string;
    content?: string;
    category?: { name?: string };
  },
>(
  req: TypedRequest<T>,
  res: Response,
  next: NextFunction,
): void => {
  const { title, content, category } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return next(new AppError("Title is required and must be a string", 400));
  }
  if (title.trim().length > 100) {
    return next(new AppError("Title cannot exceed 100 characters", 400));
  }
  if (!content || typeof content !== "string" || content.trim() === "") {
    return next(new AppError("Content is required and must be a string", 400));
  }
  if (!category || !category.name) {
    return next(new AppError("Category with a name is required", 400));
  }
  if (!VALID_CATEGORIES.includes(category.name.toLowerCase())) {
    return next(
      new AppError(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        400,
      ),
    );
  }
  next();
};

export const validateUpdateNote = <
  T extends {
    title?: string;
    content?: string;
    category?: { name?: string };
  },
>(
  req: TypedRequest<T>,
  res: Response,
  next: NextFunction,
): void => {
  const { title, content, category } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return next(new AppError("Title must be a non-empty string", 400));
    }
    if (title.trim().length > 100) {
      return next(new AppError("Title cannot exceed 100 characters", 400));
    }
  }
  if (content !== undefined) {
    if (typeof content !== "string" || content.trim() === "") {
      return next(new AppError("Content must be a non-empty string", 400));
    }
  }
  if (category !== undefined && category.name !== undefined) {
    if (!VALID_CATEGORIES.includes(category.name.toLowerCase())) {
      return next(
        new AppError(
          `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
          400,
        ),
      );
    }
  }
  next();
};

// ─── NEW: Validate Register ────────────────────────────────────────────────
export const validateRegister = <
  T extends {
    name?: string;
    email?: string;
    password?: string;
  },
>(
  req: TypedRequest<T>,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return next(new AppError("Name is required", 400));
  }
  if (!email || typeof email !== "string") {
    return next(new AppError("Email is required", 400));
  }

  // Simple email format check
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }
  if (!password || password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }
  next();
};

// ─── NEW: Validate Login ───────────────────────────────────────────────────
export const validateLogin = <
  T extends {
    email?: string;
    password?: string;
  },
>(
  req: TypedRequest<T>,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return next(new AppError("Email is required", 400));
  }
  if (!password || typeof password !== "string") {
    return next(new AppError("Password is required", 400));
  }
  next();
};
