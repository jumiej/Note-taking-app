import mangoose, { Document, Schema } from "mongoose";
import { INote } from "../interfaces/index";

// Extend mongoose Document with our INote interface
export interface INoteDocument extends Omit<INote, "_id">, Document {}

// Category sub-schema — stored inside each note
const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    enum: {
      values: ["work", "personal", "study", "health", "finance", "other"],
      message:
        "Category must be: work, personal, study, health, finance, or other",
    },
  },
  color: {
    type: String,
    trim: true,
    default: "gray",
  },
});

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: categorySchema,
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Index on category name for faster queries
NoteSchema.index({ "category.name": 1 });

export default mangoose.model<INoteDocument>("Note", NoteSchema);
