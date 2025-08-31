import { Request, Response } from "express";
import { config } from "../config.js";

export const handlerMetrics = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`Hits: ${config.fileserverHits}`);
};
