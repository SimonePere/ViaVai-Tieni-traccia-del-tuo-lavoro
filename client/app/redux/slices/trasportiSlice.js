//Lo slice contiene insieme sia la action che il reducer:
//La action dice dove deve cambiare lo stato,
// il reducer ha le funzioni che modificano lo stato

import { createSlice } from "@reduxjs/toolkit";

const trasportiSlice = createSlice({
    name: "trasporti",
    initialState: {
        trasporti: [], // Stato iniziale: un array vuoto per i trasporti
    },
    reducers: {
        setTrasporti: (state, action) => {
            const newTrasportiData = action.payload; // Crea una costante per i nuovi dati dei trasporti
            console.log('Nuovi dati trasporti ricevuti da trasportiSlice:', newTrasportiData); // Log dei nuovi dati
            state.trasporti = newTrasportiData; // Imposta i dati dei trasporti nello stato
            console.log('Stato aggiornato dei trasporti da trasportiSlice:', state.trasporti); // Log dello stato aggiornato
        },
        clearTrasporti: (state) => {
            console.log('Pulizia dei trasporti da trasportiSlice...'); // Log prima della pulizia
            state.trasporti = []; // Pulisce i dati dei trasporti
            console.log('Stato dei trasporti dopo pulizia da trasportiSlice:', state.trasporti); // Log dello stato dopo la pulizia
        },
    },

})

// Esporta le azioni generate dalla slice, utilizzate in giro
export const { setTrasporti, clearTrasporti } = trasportiSlice.actions;

// Esporta il reducer. viene utilizzato nello store
export default trasportiSlice.reducer;

// Riepilogo
// Reducers: Funzioni che definiscono come lo stato cambia in risposta a un'azione.

// setTrasporti: Imposta i dati dei trasporti nello stato utilizzando action.payload.

// clearTrasporti: Ripristina lo stato dei trasporti a un array vuoto.

// Esportazione delle Azioni: Le azioni setTrasporti e clearTrasporti vengono esportate per essere utilizzate in altri file.

// Esportazione del Reducer: Il reducer viene esportato per essere utilizzato nella configurazione dello store.