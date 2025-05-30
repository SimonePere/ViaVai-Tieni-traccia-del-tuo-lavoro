/** @format */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Utente from "../models/utenteSchema.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).json({ message: "Token mancante" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const foundedUserByToken = await Utente.findById(decodedToken.id);

    if (!foundedUserByToken) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    req.user = foundedUserByToken;
    next();
  } catch (error) {
    console.log("Errore di verifica token:", error);
    return res.status(403).json({ message: "Token non valido" });
  }
};

export default authenticateToken;
