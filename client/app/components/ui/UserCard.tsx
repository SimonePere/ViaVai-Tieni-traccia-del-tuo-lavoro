"use client";
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import Image from "next/image";
import { Utente } from "@/app/types/utente"; // Importiamo il tipo per l'utente
import { useState } from "react"; // Importa useState
import EditForm from "./EditForm"; // Importa il componente EditForm
import { useDispatch, useSelector } from "react-redux";
import { HiCheck, HiX } from "react-icons/hi";
import Pop from "./Pop";
import { TrasportoInterface } from "../../types/trasporto";
import { setUsers } from "@/app/redux/slices/usersSlice";
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

interface UserCardProps {
  user: Utente;
  onUserUpdate?: (updatedUser: Utente) => void;
  onDelete: () => void;
}

const UserCard = ({ user, onUserUpdate, onDelete }: UserCardProps) => {
  const [editFormState, setEditFormState] = useState<Utente | null>(null); // Stato per gestire l'edit form
  const [showPop, setShowPop] = useState(false);
  const [popConfig, setPopConfig] = useState({
    message: "",
    icon: <></>,
    color: "",
  });

  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth);

  const handleEditClick = () => {
    setEditFormState(user); // Imposta l'utente corrente per l'edit
  };

  const handleSave = async (updatedData: Utente | TrasportoInterface) => {
    try {
      if ("nome" in updatedData && "email" in updatedData) {
        const apiResponse = await fetch(
          `${LOCAL_HOST}/utenti/${(updatedData as Utente)._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!apiResponse.ok) {
          throw new Error("Errore durante l'aggiornamento dell'utente");
        }

        const risultato = await apiResponse.json();
        console.log("Utente aggiornato con successo:", risultato);

        // Chiudi il form
        setEditFormState(null);

        // Ricarica tutti gli utenti
        const refreshResponse = await fetch(`${LOCAL_HOST}/utenti`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          dispatch(setUsers(refreshedData));
        }

        // Mostra Pop di successo
        setPopConfig({
          message: "Profilo utente aggiornato con successo!",
          icon: <HiCheck className="h-5 w-5 text-green-500" />,
          color: "green-500",
        });
        setShowPop(true);

        setTimeout(() => {
          setShowPop(false);
        }, 3000);
      }
    } catch (errore) {
      console.error("Errore durante il salvataggio:", errore);
      setPopConfig({
        message: "Errore durante l'aggiornamento del profilo",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);

      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    setEditFormState(null);
  };

  return (
    <Card className="max-w-sm">
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}
      <div className="flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <DropdownItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleEditClick}
            >
              Modifica
            </a>
          </DropdownItem>
          <DropdownItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Esporta Dati
            </a>
          </DropdownItem>
          <DropdownItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onDelete}
            >
              Elimina
            </a>
          </DropdownItem>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10">
        <Image
          alt={`${user.nome} ${user.cognome}`}
          height="96"
          src={user.immagineProfilo || "/images/avatars/profilo.webp"} // Sostituire con immagine profilo se disponibile
          width="96"
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {user.nome} {user.cognome}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {user.email || "Email non disponibile"}
        </span>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Telefono: {user.telefono || "Telefono non disponibile"}
        </p>

        {user.utente_citta ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <p>{user.utente_citta || "Indirizzo non disponibile"}, </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Indirizzo non disponibile
          </p>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Registrato il:{" "}
          {user.dataRegistrazione
            ? new Date(user.dataRegistrazione).toLocaleDateString("it-IT")
            : "Data di registrazione non disponibile"}
        </p>

        <div className="mt-4 flex space-x-3 lg:mt-6">
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            Aggiungi amico
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Messaggio
          </a>
        </div>
      </div>

      {editFormState && (
        <EditForm
          data={editFormState}
          onSave={handleSave}
          onClose={handleClose}
          type="utente"
        />
      )}
    </Card>
  );
};

export default UserCard;
