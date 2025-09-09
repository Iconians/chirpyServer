import { db } from "../index.js";
import { chirps } from "../schema.js";
import { randomUUID } from "crypto";
export async function createChirp({ body, userId, }) {
    const id = randomUUID();
    const now = new Date();
    const [row] = await db
        .insert(chirps)
        .values({
        id,
        body,
        userId: userId,
        createdAt: now,
        updatedAt: now,
    })
        .returning();
    return row;
}
