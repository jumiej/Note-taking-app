import { Router } from "express";
import {
  getAllNotes,
  getNoteById,
  getNotesByCategory,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController";
import { validateCreateNote, validateUpdateNote } from "../middleware/validate";
import protect from "../middleware/auth";

const router = Router();

// protect runs on ALL routes below, must have valid token
router.use(protect);

router.get("/", getAllNotes);
router.get("/categories/:categoryId", getNotesByCategory);
router.get("/:id", getNoteById);
router.post("/", validateCreateNote, createNote);
router.put("/:id", validateUpdateNote, updateNote);
router.delete("/:id", deleteNote);

export default router;
