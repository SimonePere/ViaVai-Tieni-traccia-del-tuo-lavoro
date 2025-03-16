"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Per accedere allo stato Redux
import Dashboard from "@/app/components/layout/Dashboard";
import { setTrasporti } from "@/app/redux/slices/trasportiSlice";
import GridList from "@/app/components/ui/GridList";
import { fetchTrasporti, createTrasporto, deleteTrasporto } from "@/app/hooks/services/trasportiServices";

const TrasportiPage: React.FC = () => {
  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth); // Recupera il token da Redux
  const { trasporti } = useSelector((state: any) => state.trasporti); // Stato dei trasporti

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

  const handleCreate = async (newTrasporto: any) => {
    try {
      await createTrasporto(newTrasporto, access_token);
      fetchData(); // Ricarica i dati dopo la creazione
    } catch (error) {
      console.error("Errore durante la creazione del trasporto:", error);
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

  useEffect(() => {
    fetchData(); // Chiamata API per recuperare trasporti quando il componente è montato
  }, [access_token]); // Effettua la chiamata ogni volta che il token cambia

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold">Gestione Trasporti</h1>
      <GridList 
        dataList={trasporti} 
        fetchData={fetchData} 
        onSave={handleCreate} 
        onDelete={handleDelete} 
      />
    </Dashboard>
  );
};

export default TrasportiPage;