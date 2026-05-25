import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";
import AppError from "../errors/AppError";

const router = Router();

// GET METHOD list all notes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
});

// GET METHOD get a single note by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
});

// POST METHOD create a new note
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    // Manual validation
    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    const newNote = await Note.create({ title, content });
    res.status(201).json({
      success: true,
      data: newNote,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE METHOD delete a note by id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await Note.findByIdAndDelete(req.params.id);
      if (!note) {
        return next(new AppError("Note not found", 404));
      }
      res.status(200).json({
        success: true,
        message: `Note with ID ${req.params.id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
