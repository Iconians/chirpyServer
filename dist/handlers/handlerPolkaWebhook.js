import { upgradeUserToChirpyRed } from "../db/queries/upgradeUserToChirpyRed.js";
import { getApiKey } from "../lib/auth.js";
import { config } from "../config.js";
export const handlerPolkaWebHook = async (req, res, next) => {
    try {
        const apiKey = getApiKey(req);
        if (!apiKey || apiKey !== config.polkaKey) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { event, data } = req.body;
        if (event !== "user.upgraded") {
            return res.sendStatus(204);
        }
        const result = await upgradeUserToChirpyRed(data.userId);
        if (result.length === 0) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
};
