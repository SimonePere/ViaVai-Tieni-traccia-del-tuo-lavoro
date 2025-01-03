/** @format */

// import Trasporto from "../models/trasportoSchema.js";

// Array di dati mockup che rispecchia il nuovo schema
let trasporti = [
  {
    id_trasporto: "TR001",
    tipo_lavoro: "Trasloco",
    tipo_giornata: {
      tipo: "trasferta",
      valore_trasferta: 150,
    },
    destinazione: "Milano, Via Roma 123",
    importo: 850.0,
  },
  {
    id_trasporto: "TR002",
    tipo_lavoro: "Installazione",
    tipo_giornata: {
      tipo: "giornata",
    },
    destinazione: "Roma, Via Napoli 45",
    importo: 350.0,
  },
  {
    id_trasporto: "TR003",
    tipo_lavoro: "Consegna",
    tipo_giornata: {
      tipo: "trasferta",
      valore_trasferta: 200,
    },
    destinazione: "Torino, Corso Francia 67",
    importo: 450.0,
  },
];

// trasporto mockup per testare funzione createTrasporto POST
// {
//     "id_trasporto": "TR004",
//     "tipo_lavoro": "Installazione",
//     "tipo_giornata": {
//         "tipo": "trasferta",
//         "valore_trasferta": 180
//     },
//     "destinazione": "Firenze, Viale dei Colli 42",
//     "importo": 620.00
// }

// Ottiene tutti i trasporti
export const getTrasporti = async (req, res) => {
  try {
    //  const trasporti = await Trasporto.find();
    console.log(trasporti);
    res.status(200).json(trasporti);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Crea un nuovo trasporto
export const createTrasporto = async (req, res) => {
  try {
    const trasporto = req.body;
    trasporti.push(trasporto);
    res.send(`Trasporto ${trasporto.id_trasporto} inserito con successo!`);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


//Cerca un trasporto per id
export const getTrasportoById = async (req, res) => {
    try {
        const {id} = req.params;
        const trasporto = trasporti.find((trasporto) => trasporto.id_trasporto === id);
        res.status(200).json(trasporto);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
 }

// modificaTrasporto
export const editTrasportoById = async (req, res) => { 
    try {
        // prendiamo l'id del trasporto da modificare
        const { id } = req.params;
        // cerchiamo il trasporto da modificare con l'id
        const trasporto = trasporti.find((trasporto) => trasporto.id_trasporto === id);
        if (!trasporto) {
            return res.status(404).send("Trasporto non trovato" );
        }
        // prendiamo i dati da modificare e li scomponiamo per averli in variabili
        const { tipo_lavoro, tipo_giornata, destinazione, importo } = req.body;

        if(tipo_lavoro){
            trasporto.tipo_lavoro = tipo_lavoro;
        }
        if(tipo_giornata){
            trasporto.tipo_giornata = tipo_giornata;
        }
        if(destinazione){
            trasporto.destinazione = destinazione;
        }
        if(importo){
            trasporto.importo = importo;
        }
        console.log("Trasporto modificato con successo!", trasporto);
        res.status(200).json(trasporto);
        } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



// cancellaTrasporto
export const deleteTrasportoById = async (req, res) => {
    try {
        // prendiamo l'id del trasporto da cancellare
        const { id } = req.params;
        const trasportoDaEliminare = trasporti.find((trasporto) => trasporto.id_trasporto === id);
        console.log("Trasporto da eliminare:",trasportoDaEliminare);

        if(!trasportoDaEliminare){
            return res.status(404).send( "Trasporto non trovato" );
        }
        // fa una nuova lista di trasporti ESCLUDENDO il trasporto da cancellare, 
        // NON INSERISCE SOLO IL TRASPORTO DA CANCELLARE, che è stato passsato dall'id
        const nuovaListaTrasporti = trasporti.filter((trasporto) => trasporto.id_trasporto !== id);
        res.status(200).json(nuovaListaTrasporti);
        console.log(`Trasporto con id: [${id}] eliminato con successo!`);
        
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
 }
