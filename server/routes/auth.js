/** @format */

import express from "express";
import { register, login, verifyToken } from "../controllers/auth.js";
import pippo from "../middlewares/auth.js";

const router = express.Router();

// Auth Register
router.post("/register", register);
// Auth Login
router.post("/login", login);
// Verifica Token Autenticato
router.get("/verify", pippo, verifyToken);

// //GET per id
// router.get("/:id", getUtenteById);
// // modifica
// router.patch("/:id", editUtenteById);
// // cancella
// router.delete("/:id", deleteUtenteById);

export default router;
