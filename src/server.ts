import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import noteRoutes from "./routes/noteRoutes";
import AppError from "./errors/AppError";
import logger from "./middleware/logger";

// load environment variables first
dotenv.config();

const app: Application = express();

// Custom logger middleware
app.use(logger);

// Middleware to parse JSON bodies
app.use(express.json());

// Route handlers
app.use("/api/notes", noteRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // include stack trace in development
  });
});

//  start the server after connecting to the database
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT} mode on port ${PORT}`,
    );
  });
};
startServer();
