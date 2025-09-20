import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, validateJWT } from "../lib/auth.js";
import { config } from "../config.js";
export const handlerUpdateUser = async (req, res, next) => {
    try {
        // --- check for token ---
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or malformed token" });
        }
        const token = authHeader.split(" ")[1];
        // --- verify JWT (get userId from sub claim) ---
        let userId;
        try {
            userId = validateJWT(token, config.jwtSecret);
        }
        catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        // --- hash new password ---
        const hashedPassword = await hashPassword(password);
        // --- update user ---
        const [updatedUser] = await db
            .update(users)
            .set({
            email,
            hashedPassword,
            updatedAt: new Date(),
        })
            .where(eq(users.id, userId))
            .returning({
            id: users.id,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(updatedUser);
    }
    catch (err) {
        next(err);
    }
};
