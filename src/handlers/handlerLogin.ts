import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPassword } from "../lib/auth.js";

export const handlerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const valid = await checkPassword(password, user.hashedPassword);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
