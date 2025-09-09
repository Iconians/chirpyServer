import { config } from "../config.js";
import { createUser, deleteUsers } from "../db/queries/users.js";
export async function handlerCreateUser(req, res, next) {
    try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ error: "Invalid email" });
        }
        const user = await createUser({ email });
        if (!user) {
            res.status(500).json({ error: "Failed to create user" });
        }
        return res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
}
export async function handlerReset(req, res, next) {
    try {
        if (config.platform !== "dev") {
            return res.status(403).json({ error: "Forbidden" });
        }
        await deleteUsers();
        return res.status(200).json({ message: "All users deleted" });
    }
    catch (err) {
        next(err);
    }
}
