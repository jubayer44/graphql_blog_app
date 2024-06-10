import path from "path";

require("dotenv").config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt: {
    secret: process.env.SECRET_TOKEN,
    secretExpiresIn: process.env.SECRET_TOKEN_EXPIRESIN,
  },
};
