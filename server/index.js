/** @format */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import trasportiRoutes from "./routes/trasporti.js";
import utentiRoutes from "./routes/utenti.js";
import authRoutes from "./routes/auth.js";
import tokenLogin from "./middlewares/auth.js";

dotenv.config();

const app = express();

// Configurazione CORS PER DEPLOY
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000", // Porta 3000 per Next.js
    credentials: true,
  })
);

//middleware per leggere il body delle richieste
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//GET Homepage
app.get("/", (req, res) => {
  console.log("Chiamata GET Homepage");
  res.send("Benvenuto in Gestionale Trasporti!");
});

app.use("/trasporti", tokenLogin, trasportiRoutes);
app.use("/utenti", tokenLogin, utentiRoutes);
// app.use("/trasporti", trasportiRoutes);
app.use("/auth", authRoutes);
// app.use('/guadagni', guadagniRoutes);

// Aggiungo un middleware per gestire gli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Qualcosa è andato storto!");
});

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server in esecuzione sulla porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    console.error("Errore di connessione al database:", error.message);
    process.exit(1);
  });
