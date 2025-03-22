"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Per accedere allo stato Redux
import Dashboard from "@/app/components/layout/Dashboard";
import { setTrasporti } from "@/app/redux/slices/trasportiSlice";
import GridList from "@/app/components/ui/GridList";
import { fetchTrasporti, createTrasporto, deleteTrasporto } from "@/app/hooks/services/trasportiServices";
import { Button } from "flowbite-react";
import { HiCheck, HiPlus, HiX } from "react-icons/hi";
import CreateForm from "@/app/components/ui/CreateForm";
import { Utente } from "@/app/types/utente";
import { TrasportoInterface } from "@/app/types/trasporto";
import Pop from "@/app/components/ui/Pop";


const TrasportiPage: React.FC = () => {
  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth); // Recupera il token da Redux
  const { trasporti } = useSelector((state: any) => state.trasporti); // Stato dei trasporti
  const [createFormState, setCreateFormState] = useState<boolean>(false); // Stato per gestire il CreateForm
 // Inizializza come array vuoto
 const [formType, setFormType] = useState<"utente" | "trasporto">("trasporto");
 // Aggiungi stati per il Pop
 const [showPop, setShowPop] = useState(false);
 const [popConfig, setPopConfig] = useState({
   message: "",
   icon: <></>,
   color: "",
 });

  // Funzione per ottenere i trasporti con fetch
  const fetchData = async () => {
    if (access_token) {
      try {
        const data = await fetchTrasporti(access_token);
        dispatch(setTrasporti(data)); // Imposta i trasporti nel Redux
      } catch (error) {
        console.error("Errore nel recupero dei trasporti:", error);
      }
    }
  };

  const handleNewTrasporto = () => {
    setCreateFormState(true); // Mostra il CreateForm
    setFormType("trasporto"); // Imposta il tipo di form
  };

  const handleSave = async (updatedData: Utente | TrasportoInterface) => {
    try {
      const risultato = await createTrasporto(updatedData as TrasportoInterface, access_token); // Usa la funzione di create
      console.log("Nuovo trasporto aggiunto con successo:", risultato);

      // Chiudi il form e resetta lo stato
      setCreateFormState(false);
      await fetchData(); // Ricarica i trasporti

      // Mostra Pop di successo
      setPopConfig({
        message: "Nuovo trasporto aggiunto con successo!",
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
        message: "Errore durante l'aggiunta del trasporto",
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
 

  const handleDelete = async (trasporto: any) => {
    try {
      await deleteTrasporto(trasporto._id, access_token);
      fetchData(); // Ricarica i dati dopo l'eliminazione
    } catch (error) {
      console.error("Errore durante l'eliminazione del trasporto:", error);
    }
  };

  const handleCreate = async (newTrasporto: any) => {
    try {
      await createTrasporto(newTrasporto, access_token);
      fetchData(); // Ricarica i dati dopo la creazione
    } catch (error) {
      console.error("Errore durante la creazione del trasporto:", error);
    }
  };

  // const handleClose = () => {
  //   console.log("EditForm chiuso senza salvare.");
  //   setEditFormState(null);
  //   setTimeout(() => {
  //     setEditFormState(null); // Forza un reset più sicuro
  //   }, 100);
  //   setFormType("trasporto");
  // };

  const handleCloseCreateForm = () => {
    setCreateFormState(false); // Chiudi il CreateForm
  };

  useEffect(() => {
    fetchData(); // Chiamata API per recuperare trasporti quando il componente è montato
  }, [access_token]); // Effettua la chiamata ogni volta che il token cambia

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold">Gestione Trasporti</h1>
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}
      <GridList 
        dataList={trasporti} 
        fetchData={fetchData} 
        onSave={handleCreate} 
        onDelete={handleDelete} 
      />

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
          onClick={handleNewTrasporto}
        >
          <HiPlus className="h-6 w-6 mr-2" />
          Nuovo Trasporto
        </Button>
      </div>
    </Dashboard>
  );
};

export default TrasportiPage;