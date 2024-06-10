import jwt from "jsonwebtoken";

const createToken = (payload: { userId: string }) => {
  return jwt.sign(payload, "mysecretkey", {});
};

export const jwtHelpers = {
  createToken,
};
