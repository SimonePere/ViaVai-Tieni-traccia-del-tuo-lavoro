/** @format */

"use client";

import { EasyTable } from "@/components/easy-table";

// Dati di esempio per i trasporti
const trasportiData = [
  {
    id: 1,
    tipo_lavoro: "Trasloco",
    descrizione_lavoro: "Trasloco ufficio completo",
    destinazione: "Via Roma 123, Milano",
    tipo_giornata: "Giornata",
    ore_lavoro: 8,
    importo: 500,
  },
  {
    id: 2,
    tipo_lavoro: "Installazione",
    descrizione_lavoro: "Installazione mobili ufficio",
    destinazione: "Via Milano 456, Roma",
    tipo_giornata: "Trasferta",
    ore_lavoro: 4,
    importo: 300,
  },
];

// Dati di esempio per gli utenti
const utentiData = [
  {
    id: 1,
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.com",
    telefono: "3331234567",
    utente_citta: "Milano",
    dataRegistrazione: "2024-03-15",
  },
  {
    id: 2,
    nome: "Luigi",
    cognome: "Verdi",
    email: "luigi.verdi@email.com",
    telefono: "3337654321",
    utente_citta: "Roma",
    dataRegistrazione: "2024-03-14",
  },
];

export default function ListaTrasporti() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista Trasporti</h2>
      <EasyTable data={trasportiData} type="trasporto" />

      <h2 className="text-2xl font-bold mb-4 mt-8">Lista Utenti</h2>
      <EasyTable data={utentiData} type="utente" />
    </div>
  );
}
