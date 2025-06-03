/** @format */

// types/utente.ts

export interface UtenteInterface {
  _id?: string;
  id?: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  utente_citta: string;
  dataRegistrazione: string;
  immagineProfilo?: string;
}
