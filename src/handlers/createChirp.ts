import { Request, Response, NextFunction } from "express";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("handlerCreateChirp req.body:", req.body);
    const { body, userId } = req.body;

    if (!body || typeof body !== "string") {
      return res.status(400).json({ error: "Invalid chirp body" });
    }

    if (body.length > 280) {
      return res.status(400).json({ error: "Chirp is too long" });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    const chirp = await createChirp({ body, userId });

    return res.status(201).json(chirp);
  } catch (err) {
    console.error("Error in handlerCreateChirp:", err);
    next(err);
  }
}
