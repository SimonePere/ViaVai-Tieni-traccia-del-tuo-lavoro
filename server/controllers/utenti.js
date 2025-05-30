
import Utente from "../models/utenteSchema.js";

// Ottiene tutti gli utenti
export const getUtenti = async (req, res) => {
  try {
    const utenti = await Utente.find({}, 'nome cognome _id dataRegistrazione email telefono _id utente_citta '); // Restituisce solo nome, cognome e ID e non manda dati sensibili, come password ecc
    // const utenti = await Utente.find({}); // Restituisce TUTTO
    console.log(utenti);
    res.status(200).json(utenti);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Crea un nuovo utente
export const createUtente = async (req, res) => {
  try {
    const utente = req.body;
    const newUtente = new Utente(utente);
    await newUtente.save();
    res.status(201).json(newUtente);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Cerca un utente per id
export const getUtenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const utente = await Utente.findById(id);
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(utente);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// modificaUtente
export const editUtenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const utente = await Utente.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(utente);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// cancellaUtente
export const deleteUtenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const utente = await Utente.findByIdAndDelete(id);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json({ message: "Utente eliminato con successo" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
