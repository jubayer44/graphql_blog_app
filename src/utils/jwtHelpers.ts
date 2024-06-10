import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const createToken = (payload: { userId: number }, secret: Secret) => {
  return jwt.sign(payload, secret, { expiresIn: config.jwt.secretExpiresIn });
};

export const jwtHelpers = {
  createToken,
};
