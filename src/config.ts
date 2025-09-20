process.loadEnvFile();
import type { MigrationConfig } from "drizzle-orm/migrator";

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export type APIConfig = {
  fileserverHits: number;
  // dbURL: string;
  db: DBConfig;
  platform: string;
  jwtSecret: string;
  jwtDefaultExpiresIn: number;
  polkaKey: string;
};

export function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable ${key}`);
  return val;
}

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./src/db/migrations",
    },
  },
  platform: envOrThrow("PLATFORM"),
  jwtSecret: envOrThrow("JWT_SECRET"),
  jwtDefaultExpiresIn: 60 * 60,
  polkaKey: envOrThrow("POLKA_KEY"),
  // dbURL:
};
