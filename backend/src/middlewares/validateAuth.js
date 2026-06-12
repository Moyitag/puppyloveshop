import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const validateAuth = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.authCookie || bearerToken;

    if (!token) {
      return res.status(401).json({ message: "Debes iniciar sesión" });
    }

    const decoded = jsonwebtoken.verify(token, config.jwt.secret || config.JWT.secret);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("error" + error);
    return res.status(401).json({ message: "Sesión inválida o expirada" });
  }
};

export default validateAuth;
