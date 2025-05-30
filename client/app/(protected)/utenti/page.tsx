/** @format */

"use client";

import { useDispatch, useSelector } from "react-redux"; // Per accedere allo stato Redux
import { useState, useEffect } from "react";
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
import SmallList from "@/app/components/ui/SmallList";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

interface UsersListProps {
  trasporti?: TrasportoInterface[];
  utenti?: Utente[];
}

const UtentiPage: React.FC<UsersListProps> = ({
  trasporti = [],
  utenti = [],
}) => {
  // Aggiungi qui lo state per il mobile
  const [isMobile, setIsMobile] = useState(false);
  // Aggiungi stato per l'utente selezionato da mobile
  const [selectedUser, setSelectedUser] = useState<Utente | null>(null);

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

  // Aggiungi qui l'useEffect per il mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 868);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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

  // Funzione per selezionare un utente dalla lista mobile
  const handleUserSelect = (user: Utente) => {
    setSelectedUser(user);
  };

  // Funzione per chiudere la UserCard da mobile
  const handleCloseUserCard = () => {
    setSelectedUser(null);
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
    <>
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}

      {/* Mostra la UserCard dell'utente selezionato su mobile */}
      {isMobile && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseUserCard} // Chiude quando si clicca sullo sfondo
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Previene la chiusura quando si clicca sulla card
          >
            <div className="text-right mb-2">
              <button
                onClick={handleCloseUserCard}
                className="text-white text-sm px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                Chiudi
              </button>
            </div>
            <UserCard
              user={selectedUser}
              onDelete={() =>
                selectedUser._id && handleDeleteUser(selectedUser._id)
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <p>Nessun utente trovato.</p>
        ) : isMobile ? (
          <SmallList users={users} onUserSelect={handleUserSelect} />
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
        {users.length === 0 ? (
          <p></p>
        ) : (
          <Button
            gradientDuoTone="greenToBlue"
            size="lg"
            pill
            onClick={handleNewUtente}
          >
            <HiPlus className="h-6 w-6 mr-2" />
            Nuovo Utente
          </Button>
        )}
      </div>
    </>
  );
};

export default UtentiPage;

// Dopo ogni operazione (create/update/delete) chiami fetchUsers()
// fetchUsers aggiorna lo stato Redux con dispatch(setUsers(data))
// Quindi anche se non usi uno slice specifico per l'update, i dati vengono comunque aggiornati

// Ottimizzazione Possibile:
// Creando uno slice per l'update per evitare
// di ricaricare tutti gli utenti
// Aggiornando lo stato Redux localmente
// invece di fare una nuova chiamata API
// Riducendo il numero di chiamate al server
// Ma il tuo approccio attuale funziona
// perché mantieni la sincronizzazione tra il
// frontend e il backend ricaricando sempre
// i dati freschi dal Server.
