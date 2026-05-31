import { Request } from "express";

// category Interface
export interface ICategory {
  _id?: number;
  name: string;
  color?: string; // color is optional
}

// Note Interface
export interface INote {
  _id?: number;
  title: string;
  content: string;
  category: ICategory; //  category is now part of Note
  createdAt?: Date;
  updatedAt?: Date;
}

//  Request Body Interfaces
// These describe exactly what we expect in req.body

export interface createNoteBody {
  title: string;
  content: string;
  category: {
    name: string;
    color?: string;
  };
}

export interface updateNoteBody {
  title?: string;
  content?: string;
  category?: {
    name: string;
    color?: string;
  };
}

// This gives us full type safety on request bodies
export interface TypedRequest<T> extends Request {
  body: T;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string;
}
