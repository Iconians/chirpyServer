import { asc, eq } from "drizzle-orm";
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
export const getAllChirps = async () => {
    const rows = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return rows.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        body: row.body,
        userId: row.userId,
    }));
};
export const getChirpById = async (id) => {
    const [row] = await db.select().from(chirps).where(eq(chirps.id, id));
    if (!row)
        return null;
    return {
        id: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        body: row.body,
        userId: row.userId,
    };
};
