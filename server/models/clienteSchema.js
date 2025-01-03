const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cognome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String
  },
  indirizzo: {
    via: String,
    citta: String,
    cap: String,
    provincia: String
  },
  dataRegistrazione: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);
