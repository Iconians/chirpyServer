import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

export const getUserByEmail = async (email: string) => {
  const [row] = await db.select().from(users).where(eq(users.email, email));
  return row || null;
};

export async function deleteUsers() {
  await db.delete(users);
}
