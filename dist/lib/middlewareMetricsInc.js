import { config } from "../config.js";
export const middlewareMetricsInc = (req, res, next) => {
    if (req.path.startsWith("/app")) {
        config.fileserverHits += 1;
    }
    next();
};
