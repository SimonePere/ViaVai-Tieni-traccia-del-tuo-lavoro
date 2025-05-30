/** @format */

"use client";

import { EasyTable } from "@/components/easy-table";

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

export default function ListaUtenti() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 mt-8">Lista Utenti</h2>
      <EasyTable data={utentiData} type="utente" />
    </div>
  );
}
