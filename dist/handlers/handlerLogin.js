import { getUserByEmail } from "../db/queries/users.js";
import { checkPassword, makeJWT, makeRefreshToken } from "../lib/auth.js";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { refreshTokens } from "../db/schema.js";
const ACCESS_TOKEN_EXP = 3600;
const REFRESH_TOKEN_EXP_DAYS = 60;
export const handlerLogin = async (req, res, next) => {
    try {
        const { email, password, expiresInSeconds } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Incorrect email or password" });
        }
        const valid = await checkPassword(password, user.hashedPassword);
        if (!valid) {
            return res.status(401).json({ error: "Incorrect email or password" });
        }
        // determine expiry: optional client-provided, default 1 hour, max 1 hour
        // const maxExpiry = config.jwtDefaultExpiresIn ?? 3600;
        // let expiry =
        //   typeof expiresInSeconds === "number"
        //     ? Math.floor(expiresInSeconds)
        //     : maxExpiry;
        // if (expiry > maxExpiry) expiry = maxExpiry;
        // if (expiry <= 0) expiry = maxExpiry;
        const token = makeJWT(user.id, ACCESS_TOKEN_EXP, config.jwtSecret);
        const refreshToken = makeRefreshToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXP_DAYS);
        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: user.id,
            expiresAt,
        });
        return res.status(200).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token,
            refreshToken,
            isChirpyRed: user.isChirpyRed,
        });
    }
    catch (err) {
        next(err);
    }
};
