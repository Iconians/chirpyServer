import { Request, Response, NextFunction } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export const handlerGetChirps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chirps = await getAllChirps();
    return res.status(200).json(chirps);
  } catch (err) {
    console.error("Error in handlerGetChirps:", err);
    next(err);
  }
};
