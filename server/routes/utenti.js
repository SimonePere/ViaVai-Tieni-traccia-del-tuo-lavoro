/** @format */

import express from "express";
import {
  getUtenti,
  createUtente,
  getUtenteById,
  editUtenteById,
  deleteUtenteById,
} from "../controllers/utenti.js";

const router = express.Router();

//GET tutti gli utenti
router.get("/", getUtenti);
// creaUtente
router.post("/", createUtente);
//GET un utente per id
router.get("/:id", getUtenteById);
// modificaUtente
router.patch("/:id", editUtenteById);
// cancellaUtente
router.delete("/:id", deleteUtenteById);

export default router;
