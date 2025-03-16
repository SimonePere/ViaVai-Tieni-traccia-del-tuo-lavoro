"use client"
import React, { useState } from "react";
import EditForm from "../components/ui/EditForm";
import { Utente } from "../types/utente"; // Assicurati che il percorso sia corretto
import { TrasportoInterface } from "../types/trasporto"; // Assicurati che il percorso sia corretto
import Dashboard from "../components/layout/Dashboard";
import { Button } from "flowbite-react";


const TestUtentiPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Utente | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const users: Utente[] = [
    {
      _id: "1",
      nome: "Mario",
      cognome: "Rossi",
      email: "mario.rossi@example.com",
      telefono: "1234567890",
      dataRegistrazione: new Date(),
    },
    {
      _id: "2",
      nome: "Luigi",
      cognome: "Verdi",
      email: "luigi.verdi@example.com",
      telefono: "0987654321",
      dataRegistrazione: new Date(),
    },
  ];

  const handleEditUser = (user: Utente) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleSaveUser = (updatedUser: Utente | TrasportoInterface) => {
    console.log("Utente aggiornato:", updatedUser);
    setIsEditing(false);
    setSelectedUser(null);
  };

  return (
      <Dashboard>
          {users.map((user) => (
            <li key={user._id}>
              {user.nome} {user.cognome}
              <Button onClick={() => handleEditUser(user)}>Modifica</Button>
            </li>
          ))}
        {isEditing && selectedUser && (
          <EditForm data={selectedUser} onSave={handleSaveUser} type="utente" />
        )}
      </Dashboard>
  );
};

export default TestUtentiPage;
