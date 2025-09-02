process.loadEnvFile();
export function envOrThrow(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing environment variable ${key}`);
    return val;
}
export const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
