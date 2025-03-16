"use client";

import React, { useState } from "react";
import EditForm from "../components/ui/EditForm";
import { TrasportoInterface } from "../types/trasporto"; // Assicurati che il percorso sia corretto
import { Utente } from "../types/utente"; // Assicurati che il percorso sia corretto
import Dashboard from "../components/layout/Dashboard";
import { Button } from "flowbite-react";

const TestTrasportiPage: React.FC = () => {
  const [selectedTransport, setSelectedTransport] =
    useState<TrasportoInterface | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const transports: TrasportoInterface[] = [
    {
      tipo_lavoro: "Trasloco",
      descrizione_lavoro: "Trasloco da casa a casa",
      destinazione: "Via Roma 1",
      tipo_giornata: { tipo: "giornata", ore_lavoro: 8 },
      importo: 200,
    },
    {
      tipo_lavoro: "Installazione",
      descrizione_lavoro: "Installazione di mobili",
      destinazione: "Via Milano 2",
      tipo_giornata: { tipo: "trasferta", ore_lavoro: 5 },
      importo: 150,
    },
  ];

  const handleEditTransport = (transport: TrasportoInterface) => {
    setSelectedTransport(transport);
    setIsEditing(true);
  };

  const handleSaveTransport = (
    updatedTransport: Utente | TrasportoInterface
  ) => {
    console.log("Trasporto aggiornato:", updatedTransport);
    setIsEditing(false);
    setSelectedTransport(null);
  };

  return (
    <Dashboard>
        {transports.map((transport, index) => (
          <li key={index}>
            {transport.tipo_lavoro} - {transport.descrizione_lavoro}
            <Button onClick={() => handleEditTransport(transport)}>
              Modifica
            </Button>
          </li>
        ))}
      
      {isEditing && selectedTransport && (
        <EditForm
          data={selectedTransport}
          onSave={handleSaveTransport}
          type="trasporto"
        />
      )}
    </Dashboard>
  );
};

export default TestTrasportiPage;
