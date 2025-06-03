/** @format */

// client/app/hooks/services/trasportiServices.ts
import dotenv from "dotenv";
import { UtenteInterface } from "../../types/utente"; // Assicurati che il percorso sia corretto

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

// Funzione per recuperare gli utenti
export const fetchUtenti = async (
  token: string
): Promise<UtenteInterface[]> => {
  const response = await fetch(`${LOCAL_HOST}/utenti`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Errore nel recupero degli utenti");
  return response.json();
};

// Funzione per creare un nuovo utente
export const createUtente = async (
  data: UtenteInterface,
  token: string
): Promise<UtenteInterface> => {
  const response = await fetch(`${LOCAL_HOST}/utenti`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Errore nella creazione dell'utente");
  return response.json();
};

// Funzione per aggiornare un utente esistente
export const updateUtente = async (
  id: string,
  data: UtenteInterface,
  token: string
): Promise<UtenteInterface> => {
  const response = await fetch(`${LOCAL_HOST}/utenti/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento dell'utente");
  return response.json();
};

// Funzione per eliminare un utente
export const deleteUtente = async (
  id: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${LOCAL_HOST}/utenti/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione dell'utente");
};
