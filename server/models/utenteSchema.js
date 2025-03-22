/** @format */

import mongoose from "mongoose";

const utenteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
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
  utente_citta:{
    type: String,
  },
  dataRegistrazione: {
    type: Date,
    default: Date.now,
  },
});

const Utente = mongoose.model("Utente", utenteSchema, "utenti");
export default Utente;
