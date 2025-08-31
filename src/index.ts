import express from "express";
import { handlerReadiness } from "./handlers/handlers.js";
import { middlewareResponses } from "./lib/middlewareResponses.js";
import { middlewareMetricsInc } from "./lib/middlewareMetricsInc.js";
import { handlerMetrics } from "./handlers/handlerMetrics.js";
import { handlerReset } from "./handlers/handlerReset.js";

const app = express();
const PORT = 8080;
app.use(middlewareMetricsInc);
app.use(middlewareResponses);
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
