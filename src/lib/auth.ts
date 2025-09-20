import bcrypt from "bcrypt";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const checkPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const makeJWT = (userId: string, expiresIn: number, secret: string) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;

  const payload: Pick<JwtPayload, "iss" | "sub" | "iat" | "exp"> = {
    iss: "chirpy",
    sub: userId,
    iat,
    exp,
  };

  return jwt.sign(payload, secret);
};

export const validateJWT = (tokenSting: string, secret: string) => {
  try {
    const decode = jwt.verify(tokenSting, secret) as JwtPayload;

    if (!decode.sub) {
      throw new Error("Token missing subject (user id)");
    }

    return decode.sub as string;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export const getBearerToken = (req: Request) => {
  const auth = req.get("Authorization");

  if (!auth) {
    throw new Error("Missing Authorization header");
  }

  const parts = auth.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Malformed Authorization header");
  }

  return parts[1].trim();
};

export const makeRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const getApiKey = (req: Request) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "ApiKey") {
    return null;
  }

  return parts[1].trim();
};
