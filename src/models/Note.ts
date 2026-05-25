import mangoose, { Document, Schema } from "mongoose";

// 1 Define an interface for the Note document
export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2  Mongoose schema - describe how data is stored in mongoDB
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
  },
  {
    timestamps: true,
  },
);

export default mangoose.model<INote>("Note", NoteSchema);
