/** @format */

import mongoose from "mongoose";

const guadagnoSchema = new mongoose.Schema({
  importo: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  descrizione: {
    type: String,
  },
  metodoPagamento: {
    type: String,
    enum: ["contanti", "carta", "bonifico"],
    required: true,
  },
  fatturato: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Guadagno", guadagnoSchema);
