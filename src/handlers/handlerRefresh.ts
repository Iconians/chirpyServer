import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { refreshTokens, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";

export const handlerRefresh = async (
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
    const [record] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    if (
      !record ||
      record.revokedAt ||
      new Date(record.expiresAt) < new Date()
    ) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Get user from refresh token
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, record.userId));

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Create new access token
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: accessToken });
  } catch (err) {
    next(err);
  }
};
