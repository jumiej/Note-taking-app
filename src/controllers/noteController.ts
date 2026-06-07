import { Response, NextFunction } from "express";
import Note from "../models/Note";
import AppError from "../errors/AppError";
import {
  TypedRequest,
  CreateNoteBody,
  UpdateNoteBody,
  ApiResponse,
  AuthRequest,
} from "../interfaces";

//  GET /api/notes
export const getAllNotes = async (
  req: AuthRequest, // AuthRequest instead of Request
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Only get notes belonging to the logged-in user
    const notes = await Note.find({ user: req.user!.id }).sort({
      createdAt: -1,
    });

    const response: ApiResponse<typeof notes> = {
      success: true,
      count: notes.length,
      data: notes,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

//  GET /api/notes/:id
export const getNoteById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Find note by ID AND user — prevents users seeing each other's notes
    const note = await Note.findOne({ _id: req.params.id, user: req.user!.id });
    if (!note) return next(new AppError("Note not found", 404));

    const response: ApiResponse<typeof note> = { success: true, data: note };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

//  GET /api/notes/categories/:categoryId
export const getNotesByCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    // Filter by BOTH category and user
    const notes = await Note.find({
      "category.name": categoryId,
      user: req.user!.id,
    }).sort({ createdAt: -1 });

    if (notes.length === 0) {
      return next(
        new AppError(`No notes found for category: ${categoryId}`, 404),
      );
    }

    const response: ApiResponse<typeof notes> = {
      success: true,
      count: notes.length,
      data: notes,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

//  POST /api/notes
export const createNote = async (
  req: AuthRequest & TypedRequest<CreateNoteBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, content, category } = req.body;

    // Attach the logged-in user's id to the note
    const note = await Note.create({
      title,
      content,
      category,
      user: req.user!.id,
    });

    const response: ApiResponse<typeof note> = { success: true, data: note };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

//  PUT /api/notes/:id
export const updateNote = async (
  req: AuthRequest & TypedRequest<UpdateNoteBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Find by ID AND user — only owner can update
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!note) return next(new AppError("Note not found", 404));

    const response: ApiResponse<typeof note> = { success: true, data: note };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

//  DELETE /api/notes/:id
export const deleteNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Only owner can delete their note
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user!.id,
    });

    if (!note) return next(new AppError("Note not found", 404));

    const response: ApiResponse<null> = {
      success: true,
      message: "Note deleted successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
