import { getChirpById } from "../db/queries/chirps.js";
export const handlerGetChirpById = async (req, res, next) => {
    try {
        const { chirpID } = req.params;
        const chirp = await getChirpById(chirpID);
        if (!chirp) {
            return res.status(404).json({ error: "Chirp not found" });
        }
        return res.status(200).json(chirp);
    }
    catch (err) {
        console.log("Error in handlerGetChirpById:", err);
        next(err);
    }
};
