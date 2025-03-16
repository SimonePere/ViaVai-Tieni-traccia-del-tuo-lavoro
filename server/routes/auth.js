/** @format */

import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

// Auth Register
router.post("/register", register);
// Auth Login
router.post("/login", login);

// //GET per id
// router.get("/:id", getUtenteById);
// // modifica
// router.patch("/:id", editUtenteById);
// // cancella
// router.delete("/:id", deleteUtenteById);

export default router;
