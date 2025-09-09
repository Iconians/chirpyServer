import express from "express";
import { handlerReadiness } from "./handlers/handlers.js";
import { middlewareResponses } from "./lib/middlewareResponses.js";
import { middlewareMetricsInc } from "./lib/middlewareMetricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerReset } from "./handlers/handlerReset.js";
import { handlerChirps } from "./handlers/handlerChirps.js";
import { errorHandling } from "./lib/errorHandlingMiddleware.js";
import postgres from "postgres";
import { config } from "./config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { handlerCreateUser } from "./handlers/handlerUsers.js";
import { handlerCreateChirp } from "./handlers/createChirp.js";
async function main() {
    const migrationClient = postgres(config.db.url, { max: 1 });
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log("Migrations completed");
    const app = express();
    app.use(express.json());
    const PORT = 8080;
    app.use(middlewareMetricsInc);
    app.use(middlewareResponses);
    app.get("/api/healthz", handlerReadiness);
    app.post("/api/users", handlerCreateUser);
    app.get("/admin/metrics", handlerMetrics);
    app.post("/admin/reset", handlerReset);
    app.post("/api/validate_chirp", handlerChirps);
    app.post("/api/chirps", handlerCreateChirp);
    app.use(errorHandling);
    app.use("/app", express.static("./src/app"));
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}
main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
