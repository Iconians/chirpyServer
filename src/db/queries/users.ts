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
  console.log("deleteUsers: Starting database delete operation");
  try {
    // Try using raw SQL instead of Drizzle ORM
    const result = await db.execute("DELETE FROM users");
    console.log("deleteUsers: Database delete operation completed", result);
    return result;
  } catch (error) {
    console.error(
      "deleteUsers: Error with raw SQL, trying Drizzle ORM:",
      error
    );
    const result = await db.delete(users);
    console.log(
      "deleteUsers: Database delete operation completed with Drizzle",
      result
    );
    return result;
  }
}
