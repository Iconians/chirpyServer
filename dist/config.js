process.loadEnvFile();
export function envOrThrow(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing environment variable ${key}`);
    return val;
}
export const config = {
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
    // dbURL:
};
