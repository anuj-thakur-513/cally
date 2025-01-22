import jwt, { Secret } from "jsonwebtoken";
import keys from "../config/keys";

function generateToken(userId: number, email: string): string {
  const token = jwt.sign(
    {
      userId,
      email,
    },
    keys.jwt.secret as Secret,
    {
      expiresIn: keys.jwt.expiry,
    }
  );
  return token;
}

export default generateToken;
