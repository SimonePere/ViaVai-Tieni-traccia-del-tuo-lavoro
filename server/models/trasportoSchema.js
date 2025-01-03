import mongoose from 'mongoose';

// Schema per gestire i trasporti (traslochi, installazioni, consegne)
const trasportoSchema = new mongoose.Schema({
  // Identificativo univoco per ogni trasporto
  id_trasporto: {
    type: String,
    unique: true  // Garantisce che non ci siano duplicati
  },
  // Tipo di lavoro da eseguire - può essere solo uno dei tre valori specificati
  tipo_lavoro: {
    type: String,
    enum: ['Trasloco', 'Installazione', 'Consegna']
  },
  // Struttura per gestire il tipo di giornata lavorativa
  tipo_giornata: {
    // Può essere solo 'giornata' o 'trasferta'
    tipo: {
      type: String,
      enum: ['giornata', 'trasferta']
    },
    // Campo per il valore della trasferta
    // Viene richiesto solo se tipo_giornata.tipo è 'trasferta'
    valore_trasferta: {
      type: Number,
      required: function() {
        // Funzione custom che rende il campo obbligatorio solo se è una trasferta
        return this.tipo_giornata.tipo === 'trasferta';
      }
    }
  },
  // Luogo di destinazione del trasporto
  destinazione: {
    type: String
  },
  // Importo totale del servizio
  importo: {
    type: Number
  }
});

// Creazione del modello Mongoose basato sullo schema
const Trasporto = mongoose.model('Trasporto', trasportoSchema);
export default Trasporto;