/** @format */

import Trasporto from "../models/trasportoSchema.js";

// Ottiene tutti i trasporti
export const getTrasporti = async (req, res) => {
  try {
    const trasporti = await Trasporto.find();
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
    const newTrasporto = new Trasporto(trasporto);
    await newTrasporto.save();
    res.status(201).json(newTrasporto);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


//Cerca un trasporto per id
export const getTrasportoById = async (req, res) => {
    try {
        const {id} = req.params;
        const trasporto = await Trasporto.findById(id);
        if (!trasporto) {
            return res.status(404).json({ message: "Trasporto non trovato" });
        }
        res.status(200).json(trasporto);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

// modificaTrasporto
export const editTrasportoById = async (req, res) => { 
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const trasporto = await Trasporto.findByIdAndUpdate(id, updates, { new: true });
        if (!trasporto) {
            return res.status(404).json({ message: "Trasporto non trovato" });
        }
        
        res.status(200).json(trasporto);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



// cancellaTrasporto
export const deleteTrasportoById = async (req, res) => {
    try {
        const { id } = req.params;
        const trasporto = await Trasporto.findByIdAndDelete(id);
        
        if (!trasporto) {
            return res.status(404).json({ message: "Trasporto non trovato" });
        }
        
        res.status(200).json({ message: "Trasporto eliminato con successo" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
