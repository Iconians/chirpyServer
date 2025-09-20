import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export const upgradeUserToChirpyRed = async (userId) => {
    return db
        .update(users)
        .set({ isChirpyRed: true, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
};
