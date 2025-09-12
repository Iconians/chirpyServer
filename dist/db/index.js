import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "../config.js";
const conn = postgres(config.db.url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});
export const db = drizzle(conn, { schema });
