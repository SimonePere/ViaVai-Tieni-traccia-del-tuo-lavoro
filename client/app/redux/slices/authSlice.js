/** @format */

import { createSlice } from "@reduxjs/toolkit";

// Funzione per decodificare il token JWT
const decodeJWT = (token) => {
  try {
    // console.log("Token da decodificare:", token);
    const base64Url = token.split(".")[1];
    // console.log("Base64Url:", base64Url);
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // console.log("Base64:", base64);
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    // console.log("JSON Payload:", jsonPayload);
    const decoded = JSON.parse(jsonPayload);
    // console.log("Token decodificato:", decoded);
    return decoded;
  } catch (error) {
    console.error("Errore nella decodifica del token:", error);
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    email: null,
    access_token:
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null,
    isLoading: false,
    error: null,
    isAuthenticated:
      typeof window !== "undefined"
        ? !!localStorage.getItem("access_token")
        : false,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      console.log(
        "Payload ricevuto in loginSuccess (authSlice):",
        action.payload
      );
      state.isLoading = false;
      state.access_token = action.payload.access_token;
      state.email = action.payload.email_utente;

      // Decodifichiamo il token per ottenere il nome utente
      const decodedToken = decodeJWT(action.payload.access_token);
      // console.log("Token decodificato in loginSuccess:", decodedToken);

      // Estraiamo il nome utente dal token decodificato
      const nomeUtente = decodedToken?.nom || decodedToken?.nome;
      console.log("Nome utente estratto:", nomeUtente);

      state.user =
        nomeUtente || action.payload.email_utente?.split("@")[0] || "Utente";
      console.log("Nome utente finale salvato:", state.user);

      state.error = null;
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.access_token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.email = null;
      state.access_token = null;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      console.log("Logout effettuato con successo dal server");
    },
    //logout ancora da mettere in qualche componente per poter effettuare
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
