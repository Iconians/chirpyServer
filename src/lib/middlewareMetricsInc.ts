import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export const middlewareMetricsInc = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.startsWith("/app")) {
    config.fileserverHits += 1;
  }
  next();
};
