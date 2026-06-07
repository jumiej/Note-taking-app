import { Request } from "express";
import mongoose from "mongoose";

// category Interface
export interface ICategory {
  _id?: number;
  name: string;
  color?: string; // color is optional
}

// User Interface
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// JWT Payload Interface
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

// Note Interface
export interface INote {
  _id?: string;
  title: string;
  content: string;
  category: ICategory;
  user: mongoose.Types.ObjectId | string; // ← Accept both types
  createdAt?: Date;
  updatedAt?: Date;
}

//  Request Body Interfaces

export interface CreateNoteBody {
  title: string;
  content: string;
  category: {
    name: string;
    color?: string;
  };
}

export interface UpdateNoteBody {
  title?: string;
  content?: string;
  category?: {
    name: string;
    color?: string;
  };
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// Typed request bodies
export interface TypedRequest<T> extends Request {
  body: T;
}

// Authenticated Request
export interface AuthRequest extends Request {
  user?: JwtPayload; // The logged-in user's data from the token
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string;
  token?: string; // For auth responses
}
