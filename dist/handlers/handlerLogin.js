import { getUserByEmail } from "../db/queries/users.js";
import { checkPassword, makeJWT } from "../lib/auth.js";
import { config } from "../config.js";
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
        const maxExpiry = config.jwtDefaultExpiresIn ?? 3600;
        let expiry = typeof expiresInSeconds === "number"
            ? Math.floor(expiresInSeconds)
            : maxExpiry;
        if (expiry > maxExpiry)
            expiry = maxExpiry;
        if (expiry <= 0)
            expiry = maxExpiry;
        const token = makeJWT(user.id, expiry, config.jwtSecret);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token,
        });
    }
    catch (err) {
        next(err);
    }
};
// export const handlerLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }
//     const user = await getUserByEmail(email);
//     if (!user) {
//       return res.status(401).json({ error: "Incorrect email or password" });
//     }
//     const valid = await checkPassword(password, user.hashedPassword);
//     if (!valid) {
//       return res.status(401).json({ error: "Incorrect email or password" });
//     }
//     const maxExpiry = config.jwtDefualtExpiresIn ?? 3600;
//     let expiry = typeof expiresInSeconds === "number" ? Math.floor(expiresInSeconds) : maxExpiry;
//     if (expiry > maxExpiry) expiry = maxExpiry;
//     if (expiry <= 0) expiry = maxExpiry;
//     return res.status(200).json({
//       id: user.id,
//       email: user.email,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
