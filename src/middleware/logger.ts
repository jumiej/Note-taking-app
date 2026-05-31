import { Request, Response, NextFunction } from "express";

// shape of log entry
interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: string;
  ip: string;
}

// Logger middleware
const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now(); // record when request started

  res.on("finish", () => {
    const responseTime = Date.now() - start; // calculate how long it took to handle the request

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || "unknown",
    };

    // Color code by status: green=success, yellow=client error, red=server error
    const color =
      res.statusCode >= 500
        ? "\x1b[31m" // red for server errors
        : res.statusCode >= 400
          ? "\x1b[33m" // yellow for client errors
          : "\x1b[32m"; // green for success

    const reset = "\x1b[0m"; // reset color after logging

    console.log(
      `${color}[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} ${logEntry.statusCode} - ${logEntry.responseTime}${reset}`,
    );
  });

  next(); // pass to next middleware or controller
};

export default logger;
