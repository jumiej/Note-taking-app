import { Router } from "express";
import {
  getAllNotes,
  getNoteById,
  getNotesByCategory,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/noteController";

import { validateCreateNote, validateUpdateNote } from "../middleware/validate";

const router = Router();

router.get("/", getAllNotes);
router.get("/categories/:categoryId", getNotesByCategory);
router.get("/:id", getNoteById);
router.post("/", validateCreateNote, createNote); // Validate first, then create
router.put("/:id", validateUpdateNote, updateNote); // Validate first, then update
router.delete("/:id", deleteNote);

export default router;
