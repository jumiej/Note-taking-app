import mongoose, { Document, Schema } from "mongoose";

export interface INoteDocument extends Document {
  title: string;
  content: string;
  category: {
    name: string;
    color?: string;
  };
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema({
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
  color: { type: String, trim: true, default: "gray" },
});

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: CategorySchema,
      required: [true, "Category is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Note must belong to a user"],
    },
  },
  { timestamps: true },
);

NoteSchema.index({ "category.name": 1 });
NoteSchema.index({ user: 1 });

export default mongoose.model<INoteDocument>("Note", NoteSchema);
