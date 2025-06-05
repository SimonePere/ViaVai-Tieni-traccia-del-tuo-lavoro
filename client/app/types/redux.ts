/** @format */

// types/redux.ts

import { TrasportoInterface } from "./trasporto";
import { UtenteInterface } from "./utente";

// Stato Root
export interface RootState {
  auth: AuthState;
  register: RegisterState;
  trasporti: TrasportiState;
  users: UsersState;
}

// Stato Auth
export interface AuthState {
  access_token: string | null;
  isAuthenticated: boolean;
  user?: UtenteInterface | string;
  email?: string;
  isLoading: boolean;
  error: string | null;
}

// Stato Register
export interface RegisterState {
  isLoading: boolean;
  error: string | null;
  user?: UtenteInterface;
}

// Stato Trasporti
export interface TrasportiState {
  trasporti: TrasportoInterface[];
  loading?: boolean;
  error?: string | null;
}

// Stato Users
export interface UsersState {
  users: UtenteInterface[];
  loading?: boolean;
  error?: string | null;
}

// Definiamo i tipi base per i dati della tabella
export interface TrasportoTableData {
  id: number;
  _id?: string;
  tipo_lavoro: string;
  descrizione_lavoro: string;
  destinazione: string;
  tipo_giornata: string;
  ore_lavoro: number;
  importo: number;
}

export interface UtenteTableData {
  id: number;
  _id?: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  utente_citta: string;
  dataRegistrazione: string;
}

// Tipo union per TableData
export type TableData = TrasportoTableData | UtenteTableData;

// Tipo per i dati del form di login
export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

// Tipo per i dati del form di registrazione
export interface RegisterFormData {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  confermaPassword: string;
  telefono: string;
  utente_citta: string;
}

// Tipo per la risposta del login
export interface LoginResponse {
  status: string;
  access_token: string;
  user: UtenteInterface;
}

// Tipo per la risposta della registrazione
export interface RegisterResponse {
  message: string;
  user: UtenteInterface;
}
