import { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { validateJWT } from "../lib/auth.js";
import { config } from "../config.js";

export const handlerDeleteChirp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 🔑 1. Auth header
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];

    // 🔑 2. Verify JWT and get userId
    let userId: string;
    try {
      userId = validateJWT(token, config.jwtSecret);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // 🔑 3. Extract chirpID from params
    const chirpId = req.params.chirpID;
    if (!chirpId) {
      return res.status(400).json({ error: "Missing chirp ID" });
    }

    // 🔑 4. Find chirp
    const found = await db.select().from(chirps).where(eq(chirps.id, chirpId));

    if (found.length === 0) {
      return res.status(404).json({ error: "Chirp not found" });
    }

    const chirp = found[0];
    if (chirp.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this chirp" });
    }

    // 🔑 5. Delete chirp
    await db.delete(chirps).where(eq(chirps.id, chirpId));

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
