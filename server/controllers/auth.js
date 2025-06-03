/** @format */

import Utente from "../models/utenteSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Ottiene tutti utenti registrati
// export const getUsers = async (req, res) => {
//   try {
//     const users = await Utente.find();
//     console.log(users);
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// Auth Register
export const register = async (req, res) => {
  try {
    const { password, ...datiUtente } = req.body;
    // Controlli sulla password
    if (password.length < 10) {
      return res.status(400).json({
        message: "La password deve contenere almeno 10 caratteri",
      });
    }

    // Controllo carattere maiuscolo
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "La password deve contenere almeno una lettera maiuscola",
      });
    }

    // Controllo carattere minuscolo
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: "La password deve contenere almeno una lettera minuscola",
      });
    }

    // Controllo carattere speciale
    const caratteriSpeciali = "!@#$%^&*";
    if (!password.split("").some((char) => caratteriSpeciali.includes(char))) {
      return res.status(400).json({
        message:
          "La password deve contenere almeno un carattere speciale (!@#$%^&*)",
      });
    }

    // Versione semplificata dell'hashing
    const passwordHashed = await bcrypt.hash(password, 10);

    const newUtente = new Utente({ ...datiUtente, password: passwordHashed });

    await newUtente.save();
    res.status(201).json({
      message: "Utente creato con successo",
      utente: {
        nome: newUtente.nome,
        cognome: newUtente.cognome,
        email: newUtente.email,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Auth Login
export const login = async (req, res) => {
  try {
    const { email, password, nome } = req.body;

    const existingUser = await Utente.findOne({ email });
    console.log("Utente trovato:", existingUser);
    //troviamo una prima corrispondenza con l'email,
    // (essendo che gia di sua natura è univoca) inserito.

    if (!existingUser)
      return res
        .status(404)
        .json({ status: "error", message: "email e/o password errate" });

    //adesso quella corrispondenza che abbiamo trovato, grazie al nome,
    //dobbiamo verificare se la password che ha inserito l'utente,
    // sia effettivamente quella salvata e giusta..
    // per cui utilizziamo una funzione di bcrypt che compara le due psw

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    console.log("Password match:", passwordMatch);

    const email_utente = existingUser.email;
    const nome_utente = existingUser.nome;

    // a questo punto, se combacia il nome, e se combacia anche la psw,
    // generiamo il token con jwt per passare i dati che servono al backend
    // ovvero nome e psw, MIRACCOMANDO NON DATI SENSIBILI!!!

    if (passwordMatch) {
      const token = jwt.sign(
        { id: existingUser._id, nome: existingUser.nome },
        JWT_SECRET
      );
      return res.json({
        status: "ok",
        access_token: token,
        nome_utente: nome_utente,
        email_utente: email_utente,
      });
    }

    res
      .status(401)
      .json({ status: "error", message: "utente e/o password errate" });
  } catch (error) {
    console.error("Errore durante il login:", error);
    res
      .status(500)
      .json({ status: "error", message: "Errore interno del server" });
  }
};

// Il processo corretto è:
// Utente fa login → Server genera nuovo token
// Il token viene inviato al client
// Il client salva il token (localStorage, cookie, etc.)
// Quando serve autenticazione, il client invia il token
// Il server verifica il token usando SOLO il JWT_SECRET

// Verifica Token gia autenticato
export const verifyToken = async (req, res) => {
  try {
    // req.user è già popolato dal middleware di autenticazione
    const user = await Utente.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utente non trovato",
      });
    }

    res.json({
      status: "ok",
      access_token: req.headers.authorization.split(" ")[1], // il token attuale
      nome_utente: user.nome,
      email_utente: user.email,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Errore nella verifica del token",
    });
  }
};
