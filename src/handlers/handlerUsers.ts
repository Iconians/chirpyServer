import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { createUser, deleteUsers } from "../db/queries/users.js";
import { hashPassword } from "../lib/auth.js";
import { UserResponse } from "../db/schema.js";

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await createUser({ email, hashedPassword });

    if (!user) {
      res.status(500).json({ error: "Failed to create user" });
    }

    const { hashedPassword: _, ...rest } = user;
    const userResponse: UserResponse = rest;

    return res.status(201).json(userResponse);
  } catch (err) {
    next(err);
  }
}

export async function handlerReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (config.platform !== "dev") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await deleteUsers();
    return res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    next(err);
  }
}
