import { NextFunction, Request, Response } from "express";
import { HttpError } from "./errors.js";

export const errorHandling = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.log("unHandled error:", err);
    res.status(500).json({ error: "Something went wrong on our end" });
  }
};
