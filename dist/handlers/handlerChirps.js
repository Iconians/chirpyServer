import { BadRequestError } from "../lib/errors.js";
const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"];
export const handlerChirps = (req, res, next) => {
    try {
        const { body } = req.body;
        let cleanedBody = body;
        if (typeof body !== "string") {
            return res.status(400).json({ error: "Invalid request body" });
        }
        if (body.length > 140) {
            throw new BadRequestError("Chirp is too long. Max length is 140");
        }
        PROFANE_WORDS.forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            cleanedBody = cleanedBody.replace(regex, "****");
        });
        return res.status(200).json({ cleanedBody });
    }
    catch (err) {
        next(err);
    }
};
