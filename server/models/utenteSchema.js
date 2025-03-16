/** @format */

import mongoose from "mongoose";

const utenteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  cognome: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required:true,
  },
  password: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
  },
  indirizzo_via: {
    type: String,
  },
  indirizzo_citta: {
    type: String,
  },
  indirizzo_cap: {
    type: String,
  },
  indirizzo_provincia: {
    type: String,
  },
  dataRegistrazione: {
    type: Date,
    default: Date.now,
  },
});

const Utente = mongoose.model("Utente", utenteSchema, "utenti");
export default Utente;
