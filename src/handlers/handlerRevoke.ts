import { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { refreshTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const handlerRevoke = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const now = new Date();

    const result = await db
      .update(refreshTokens)
      .set({ revokedAt: now, updatedAt: now })
      .where(eq(refreshTokens.token, token));

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
