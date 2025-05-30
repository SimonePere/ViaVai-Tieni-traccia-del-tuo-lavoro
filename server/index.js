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
// console.log('Variabili ambiente:', {
//     MONGO_URI: process.env.MONGO_URI,
//     PORT: process.env.PORT
// });

const app = express();

//middleware per leggere il body delle richieste
app.use(express.json());

//GET Homepage
app.get("/", (req, res) => {
  console.log("Chiamata GET Homepage");
  res.send("Benvenuto in Gestionale Trasporti!");
});

app.use(cors());
app.use("/trasporti", tokenLogin, trasportiRoutes);
app.use("/utenti",tokenLogin,  utentiRoutes);
// app.use("/trasporti", trasportiRoutes);
app.use("/auth", authRoutes);
// app.use('/guadagni', guadagniRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Stiamo runnando sulla porta ${PORT}`))
  )
  .catch((error) => console.log(error.message));
