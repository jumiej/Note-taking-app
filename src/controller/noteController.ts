import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";
import AppError from "../errors/AppError";

import {
  TypedRequest,
  createNoteBody,
  updateNoteBody,
  ApiResponse,
} from "../interfaces";

// GET METHOD list all notes
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
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

// GET METHOD get a single note by id
export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    const response: ApiResponse<typeof note> = {
      success: true,
      data: note,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get METHOD category filter
export const getNotesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const notes = await Note.find({
      "category.name": categoryId,
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

// // POST METHOD create a new note

export const createNote = async (
  req: TypedRequest<createNoteBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, content, category } = req.body;

    const newNote = await Note.create({ title, content, category });
    const response: ApiResponse<typeof newNote> = {
      success: true,
      data: newNote,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// PUT METHOD update a note by id

export const updateNote = async (
  req: TypedRequest<updateNoteBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document not old one
      runValidators: true, // Run schema validators on update
    });

    if (!note) return next(new AppError("Note not found", 404));

    const response: ApiResponse<typeof note> = {
      success: true,
      data: note,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// DELETE METHOD delete a note by id

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }

    const response: ApiResponse<null> = {
      success: true,
      message: `Note with ID ${req.params.id} deleted successfully`,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
