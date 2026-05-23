import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(500).json({
    success: false,
    message: err.message ?? "Internal Server Error",
    errors: err,
  });
};

export default globalErrorHandler;
