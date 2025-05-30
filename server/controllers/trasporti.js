/** @format */

import Trasporto from "../models/trasportoSchema.js";

// Ottiene tutti i trasporti
export const getTrasporti = async (req, res) => {
  try {
    console.log("=== GET TRASPORTI ===");
    console.log("Headers ricevuti:", req.headers);
    console.log("User from request:", req.user);

    const trasporti = await Trasporto.find({ utenteId: req.user._id });
    console.log("Trasporti trovati:", trasporti);

    res.status(200).json(trasporti);
  } catch (error) {
    console.log("Errore in getTrasporti:", error);
    res.status(404).json({ message: error.message });
  }
};

// Crea un nuovo trasporto
export const createTrasporto = async (req, res) => {
  try {
    console.log("=== CREATE TRASPORTO ===");
    console.log("Headers ricevuti:", req.headers);
    console.log("User from request:", req.user);
    console.log("Body from request:", req.body);

    const newTrasporto = new Trasporto({
      ...req.body,
      utenteId: req.user._id,
    });

    console.log("Nuovo trasporto da salvare:", newTrasporto);
    await newTrasporto.save();
    console.log("Trasporto salvato con successo");

    res.status(201).json(newTrasporto);
  } catch (error) {
    console.log("Errore in createTrasporto:", error);
    res.status(404).json({ message: error.message });
  }
};

//Cerca un trasporto per id
export const getTrasportoById = async (req, res) => {
  try {
    console.log("=== GET TRASPORTO BY ID ===");
    console.log("Headers ricevuti:", req.headers);
    console.log("User from request:", req.user);
    console.log("ID trasporto:", req.params.id);

    const trasporto = await Trasporto.findOne({
      _id: req.params.id,
      utenteId: req.user._id,
    });

    if (!trasporto) {
      return res.status(404).json({
        message: "Trasporto non trovato o non hai i permessi per visualizzarlo",
      });
    }

    console.log("Trasporto trovato:", trasporto);
    res.status(200).json(trasporto);
  } catch (error) {
    console.log("Errore in getTrasportoById:", error);
    res.status(404).json({ message: error.message });
  }
};

// modificaTrasporto
export const editTrasportoById = async (req, res) => {
  try {
    console.log("=== EDIT TRASPORTO ===");
    console.log("Headers ricevuti:", req.headers);
    console.log("User from request:", req.user);
    console.log("Body from request:", req.body);
    console.log("ID trasporto:", req.params.id);

    const trasportoModificato = await Trasporto.findOneAndUpdate(
      {
        _id: req.params.id,
        utenteId: req.user._id,
      },
      req.body,
      { new: true }
    );

    if (!trasportoModificato) {
      return res.status(404).json({
        message: "Trasporto non trovato o non hai i permessi per modificarlo",
      });
    }

    console.log("Trasporto modificato:", trasportoModificato);
    res.status(200).json(trasportoModificato);
  } catch (error) {
    console.log("Errore in editTrasportoById:", error);
    res.status(404).json({ message: error.message });
  }
};

// cancellaTrasporto
export const deleteTrasportoById = async (req, res) => {
  try {
    console.log("=== DELETE TRASPORTO ===");
    console.log("Headers ricevuti:", req.headers);
    console.log("User from request:", req.user);
    console.log("ID trasporto:", req.params.id);

    const trasporto = await Trasporto.findOneAndDelete({
      _id: req.params.id,
      utenteId: req.user._id,
    });

    if (!trasporto) {
      return res.status(404).json({
        message: "Trasporto non trovato o non hai i permessi per eliminarlo",
      });
    }

    console.log("Trasporto eliminato:", trasporto);
    res.status(200).json({
      message: "Trasporto eliminato con successo",
      trasportoEliminato: trasporto,
    });
  } catch (error) {
    console.log("Errore in deleteTrasportoById:", error);
    res.status(404).json({ message: error.message });
  }
};
