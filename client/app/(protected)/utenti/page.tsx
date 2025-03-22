"use client";

import { useDispatch, useSelector } from "react-redux"; // Per accedere allo stato Redux
import { useState, useEffect } from "react";
import Dashboard from "@/app/components/layout/Dashboard";
import { Button } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { setUsers } from "@/app/redux/slices/usersSlice";
import UserCard from "@/app/components/ui/UserCard";
import Pop from "@/app/components/ui/Pop";
import dotenv from "dotenv";
import { HiPlus } from "react-icons/hi";
import EditForm from "@/app/components/ui/EditForm"; // Assicurati di avere react-icons installato
import { TrasportoInterface } from "@/app/types/trasporto";
import { Utente } from "@/app/types/utente";
import {
  fetchUtenti,
  createUtente,
  updateUtente,
  deleteUtente,
} from "@/app/hooks/services/utentiServices"; // Importa le nuove funzioni
import CreateForm from "@/app/components/ui/CreateForm";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

interface UsersListProps {
  trasporti?: TrasportoInterface[]; // Rendi le props opzionali
  utenti?: Utente[]; // Rendi le props opzionali
}

const UtentiPage: React.FC<UsersListProps> = ({
  trasporti = [],
  utenti = [],
}) => {
  const [editFormState, setEditFormState] = useState<
    Utente | TrasportoInterface | null
  >(null);
  const [createFormState, setCreateFormState] = useState<boolean>(false); // Stato per gestire il CreateForm

  // Inizializza come array vuoto
  const [formType, setFormType] = useState<"utente" | "trasporto">("utente");
  // Aggiungi stati per il Pop
  const [showPop, setShowPop] = useState(false);
  const [popConfig, setPopConfig] = useState({
    message: "",
    icon: <></>,
    color: "",
  });
  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth); // Recupera il token da Redux
  const { users } = useSelector((state: any) => state.users); // Stato degli utenti

  useEffect(() => {
    if (users.length > 0) {
      console.log("Utenti caricati, ma non imposto il form automaticamente.");
      console.log("useEffect attivato, users:", users);
    }
  }, [users]);

  const handleEditClick = (
    data: TrasportoInterface | Utente,
    type: "trasporto" | "utente"
  ) => {
    console.log("Modifica cliccata per:", data);
    setEditFormState(data);
    console.log("Stato aggiornato di editFormState:", editFormState);

    setFormType(type);
  };

  // Implementa handleDeleteUser
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUtente(userId, access_token); // Usa la funzione di delete
      // Ricarica tutti gli utenti
      await fetchUsers();

      setPopConfig({
        message: "Utente eliminato con successo!",
        icon: <HiCheck className="h-5 w-5 text-green-500" />,
        color: "green-500",
      });
      setShowPop(true);

      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    } catch (errore) {
      console.error("Errore durante l'eliminazione:", errore);
      setPopConfig({
        message: "Errore durante l'eliminazione dell'utente",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);

      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    }
  };

  // Funzione per ottenere gli utenti con fetch
  const fetchUsers = async () => {
    try {
      const data = await fetchUtenti(access_token); // Usa la funzione di fetch
      dispatch(setUsers(data)); // Imposta gli utenti nel Redux
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
    }
  };

  const handleNewUtente = () => {
    setCreateFormState(true); // Mostra il CreateForm
    setFormType("utente"); // Imposta il tipo di form
  };

  const handleSave = async (updatedData: Utente | TrasportoInterface) => {
    try {
      const risultato = await createUtente(updatedData as Utente, access_token); // Usa la funzione di create
      console.log("Nuovo utente aggiunto con successo:", risultato);

      // Chiudi il form e resetta lo stato
      setCreateFormState(false);
      await fetchUsers(); // Ricarica gli utenti

      // Mostra Pop di successo
      setPopConfig({
        message: "Nuovo utente aggiunto con successo!",
        icon: <HiCheck className="h-5 w-5 text-green-500" />,
        color: "green-500",
      });
      setShowPop(true);

      // Nascondi il Pop dopo 3 secondi
      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    } catch (errore) {
      console.error("Errore durante il salvataggio:", errore);
      setPopConfig({
        message: "Errore durante l'aggiunta dell'utente",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);

      // Nascondi il Pop dopo 3 secondi
      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    console.log("EditForm chiuso senza salvare.");
    setEditFormState(null);
    setTimeout(() => {
      setEditFormState(null); // Forza un reset più sicuro
    }, 100);
    setFormType("utente");
  };

  const handleCloseCreateForm = () => {
    setCreateFormState(false); // Chiudi il CreateForm
  };

  useEffect(() => {
    if (access_token) {
      fetchUsers(); // Chiamata API per recuperare gli utenti quando il token è presente
    }
  }, [access_token]); // Effettua la chiamata ogni volta che il token cambia

  return (
    <Dashboard>
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <p>Nessun utente trovato.</p>
        ) : (
          users.map((user: any) => (
            <UserCard
              key={user._id}
              user={user}
              onDelete={() => handleDeleteUser(user._id)}
            />
          ))
        )}
      </div>
      {editFormState && (
        <EditForm
          data={editFormState}
          onSave={handleSave}
          onClose={handleClose}
          type={formType} // Passa il tipo di form
        />
      )}
      {createFormState && (
        <CreateForm
          onSave={handleSave} // Passa la funzione di salvataggio
          onClose={handleCloseCreateForm} // Passa la funzione di chiusura
          type={formType} // Passa il tipo di form
        />
      )}

      <div className="fixed bottom-6 right-6">
        <Button
          gradientDuoTone="greenToBlue"
          size="lg"
          pill
          onClick={handleNewUtente}
        >
          <HiPlus className="h-6 w-6 mr-2" />
          Nuovo Utente
        </Button>
      </div>
    </Dashboard>
  );
};

export default UtentiPage;
