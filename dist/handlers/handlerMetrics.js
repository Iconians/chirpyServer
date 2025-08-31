import { config } from "../config.js";
export const handlerMetrics = (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(`Hits: ${config.fileserverHits}`);
};
