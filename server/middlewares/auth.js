/** @format */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Headers ricevuti:", req.headers);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.sendStatus(401).json({ message: "Token mancante" });

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      console.log("Errore di verifica token:", error); // Per debug
      return res.status(403).json({ message: "Token non valido" });
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;
