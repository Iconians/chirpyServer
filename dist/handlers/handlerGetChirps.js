import { getAllChirps } from "../db/queries/chirps.js";
export const handlerGetChirps = async (req, res, next) => {
    try {
        const chirps = await getAllChirps();
        return res.status(200).json(chirps);
    }
    catch (err) {
        console.error("Error in handlerGetChirps:", err);
        next(err);
    }
};
