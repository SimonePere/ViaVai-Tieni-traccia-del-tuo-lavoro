//Lo slice contiene insieme sia la action che il reducer:
//La action dice dove deve cambiare lo stato,
// il reducer ha le funzioni che modificano lo stato

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [], // Stato iniziale: un array vuoto per gli utenti
    },
    reducers: {
        setUsers: (state, action) => {
            const newUsersData = action.payload; // Crea una costante per i nuovi dati degli utenti
            console.log('Nuovi dati utenti ricevuti da usersSlice:', newUsersData); // Log dei nuovi dati
            state.users = newUsersData; // Imposta i dati degli utenti nello stato
            console.log('Stato aggiornato degli utenti da usersSlice:', state.users); // Log dello stato aggiornato
        },
        clearUsers: (state) => {
            console.log('Pulizia dei dati degli utenti da usersSlice...'); // Log prima della pulizia
            state.users = []; // Pulisce i dati degli utenti
            console.log('Stato degli utenti dopo pulizia da usersSlice:', state.users); // Log dello stato dopo la pulizia
        },
    },

})

// Esporta le azioni generate dalla slice, utilizzate in giro
export const { setUsers, clearUsers } = usersSlice.actions;

// Esporta il reducer. viene utilizzato nello store
export default usersSlice.reducer;

// Riepilogo
// Reducers: Funzioni che definiscono come lo stato cambia in risposta a un'azione.

// setUsers: Imposta i dati degli utenti nello stato utilizzando action.payload.

// clearUsers: Ripristina lo stato degli utenti a un array vuoto.

// Esportazione delle Azioni: Le azioni setUsers e clearUsers vengono esportate per essere utilizzate in altri file.

// Esportazione del Reducer: Il reducer viene esportato per essere utilizzato nella configurazione dello store.