/** @format */

import mongoose from "mongoose";

// Schema per gestire i trasporti (traslochi, installazioni, consegne)
const trasportoSchema = new mongoose.Schema(
  {
    // Tipo di lavoro è il primo dato fondamentale da specificare
    tipo_lavoro: {
      type: String,
      required: true,
      enum: ["Trasloco", "Installazione", "Consegna"],
    },

    // Descrizione dettagliata del lavoro da eseguire
    descrizione_lavoro: {
      type: String,
      required: true,
    },

    // Destinazione è un dato essenziale per qualsiasi tipo di trasporto
    destinazione: {
      type: String,
      required: true,
    },

    // Struttura per gestire il tipo di giornata lavorativa
    tipo_giornata: {
      type: String,
      required: true,
      enum: ["Giornata", "Trasferta"],
    },
    ore_lavoro: {
      type: Number,
      required: true,
    },

    // Importo totale del servizio (ultimo campo ma importante)
    importo: {
      type: Number,
      required: true,
    },
    utenteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creazione del modello Mongoose basato sullo schema
const Trasporto = mongoose.model("Trasporto", trasportoSchema, "trasporti");
export default Trasporto;

// La sintassi completa è:
// Primo parametro: nome del modello
// Secondo parametro: schema
// Terzo parametro: nome della collezione nel database
// Se non specificato, il nome della collezione sarà il nome del modello in minuscolo seguito da 's' (es. 'Trasporto' -> 'trasportos')
