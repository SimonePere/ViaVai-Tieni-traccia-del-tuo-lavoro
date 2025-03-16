// client/app/hooks/services/trasportiServices.ts
import dotenv from "dotenv";
import { TrasportoInterface } from "../../types/trasporto"; // Assicurati che il percorso sia corretto


dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

// Funzione per verificare se un dato è di tipo TrasportoInterface
export const isTrasporto = (data: any): data is TrasportoInterface => {
  return (data as TrasportoInterface)._id !== undefined; // Controlla se _id è presente
};


// Funzione per recuperare i trasporti
export const fetchTrasporti = async (token: string): Promise<TrasportoInterface[]> => {
  console.log(` chiamata da trasportiServices: ${LOCAL_HOST}/trasporti`)
  const response = await fetch(`${LOCAL_HOST}/trasporti`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Errore nel recupero dei trasporti');
  return response.json();
};

// Funzione per creare un nuovo trasporto
export const createTrasporto = async (data: TrasportoInterface, token: string): Promise<TrasportoInterface> => {
  console.log("Dati inviati per la creazione del trasporto:", data); 
  const response = await fetch(`${LOCAL_HOST}/trasporti`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Errore nella creazione del trasporto');
  return response.json();
};

// Funzione per aggiornare un trasporto esistente
export const updateTrasporto = async (id: string, data: TrasportoInterface, token: string): Promise<TrasportoInterface> => {
  console.log("Dati inviati per l'aggiornamento del trasporto:", { id, data });
  console.log("ID del trasporto da aggiornare:", id);
  const response = await fetch(`${LOCAL_HOST}/trasporti/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Errore nell\'aggiornamento del trasporto');
  return response.json();
};

// Funzione per eliminare un trasporto
export const deleteTrasporto = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${LOCAL_HOST}/trasporti/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Errore nell\'eliminazione del trasporto');
};

// Altre funzioni possono essere aggiunte qui...