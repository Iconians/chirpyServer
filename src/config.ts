process.loadEnvFile();
export type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable ${key}`);
  return val;
}

export const config: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow("DB_URL"),
};
