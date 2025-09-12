import { describe, it, expect } from "vitest";
import { getBearerToken, makeJWT, validateJWT } from "./auth";
import { Request } from "express";

const SECRET = "testsecret";
const USER_ID = "123e4567-e89b-12d3-a456-426614174000";

describe("JWT Helpers", () => {
  it("should create and validate a JWT", () => {
    const token = makeJWT(USER_ID, 60, SECRET);
    const result = validateJWT(token, SECRET);
    expect(result).toBe(USER_ID);
  });

  it("should reject expired JWTs", () => {
    const token = makeJWT(USER_ID, -10, SECRET);
    expect(() => validateJWT(token, SECRET)).throw("Invalid or expired token");
  });

  it("should reject JWTs signed with wrong secret", () => {
    const token = makeJWT(USER_ID, 60, SECRET);
    expect(() => validateJWT(token, "wrongsecret")).toThrow(
      "Invalid or expired token"
    );
  });
});

describe("getBearerToken", () => {
  it("extracts the token and strips Bearer prefix", () => {
    // fake Request-like object that has .get
    const req = {
      get: (name: string) => "Bearer abc.def.ghi",
    } as unknown as Request;
    const token = getBearerToken(req);
    expect(token).toBe("abc.def.ghi");
  });

  it("throws when Authorization header is missing", () => {
    const req = { get: (name: string) => undefined } as unknown as Request;
    expect(() => getBearerToken(req)).toThrow();
  });

  it("throws on malformed header", () => {
    const req = { get: (name: string) => "Token abc" } as unknown as Request;
    expect(() => getBearerToken(req)).toThrow();
  });
});
