import { Response, NextFunction } from "express";
import { TypedRequest, createNoteBody, updateNoteBody } from "../interfaces";
import AppError from "../errors/AppError";

// Valid category names
const VALID_CATEGORIES = [
  "work",
  "personal",
  "study",
  "health",
  "finance",
  "other",
];

// Validate Create Note
export const validateCreateNote = <
  T extends {
    title?: string;
    content?: string;
    category?: {
      name?: string;
    };
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

  next(); //All good ?  pass to next middleware or controller
};

// Validate Update Note
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

  // For updates, fields are optional but if provided must be valid
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
