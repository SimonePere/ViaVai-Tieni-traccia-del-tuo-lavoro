// src/
// ├── redux/
// │   └── store.js
// ├── slices/
//    └── usersSlice.js
//    └── trasportiSlice.js
//    └── guadagniSlice.js
// 


// 1. Redux/
// store.js: Questa cartella è dedicata alla configurazione dello store Redux. 
// Non è una cartella di default di Next.js, ma è stata creata appositamente per gestire
// lo stato globale dell'applicazione. 
// Puoi rinominarla in modo più esplicativo, ad esempio reduxStore/, se preferisci. 

// In questo file, configuri lo store e combini i vari reducer che utilizzerai nell'app.

// 2.features/
// usersSlice.js questa rtella è utilizzata per definire "slice" di stato,
// che rappresentano porzioni specifiche dello stato globale.
// Ogni slice contiene il suo stato iniziale, i reducer e le azioni.
// Puoi rinominarla in modo più esplicativo, ad esempio slices/, e creare file separati
// per ogni slice che rappresenta una parte del tuo stato
// (ad esempio, userSlice.js, productSlice.js, ecc.).

// Questo approccio ti aiuta a mantenere il codice organizzato e modulare.

import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/usersSlice"
import authReducer from "../slices/authSlice"
import registerReducer from "../slices/registerSlice"
import trasportiReducer from "../slices/trasportiSlice"
import loadingReducer from "../slices/loadingSlice"
 

// Configura lo store
const store = configureStore({
    reducer: {
        users: usersReducer,
        auth: authReducer, // Aggiungi il reducer degli utenti alla configurazione dello store
        register: registerReducer,
        trasporti: trasportiReducer,
        loading: loadingReducer,
    },
})

// Log della configurazione dello store
console.log('Store ViaVai configurato tutti gli stati disponibili:', store.getState());

export default store; // Esporta lo store per utilizzarlo nell'app

//Spiegazione del Codice
// Importazione di configureStore: Questa funzione di Redux Toolkit
// semplifica la creazione dello store. Gestisce automaticamente la configurazione di middleware e dev tools.

// Importazione del Reducer: Importiamo il reducer dalla slice che abbiamo
// creato (in questo caso usersSlice.js). Questo reducer gestirà
// lo stato per la porzione di stato chiamata users.

// Configurazione dello Store: Passiamo un oggetto alla funzione configureStore
// che contiene i reducer. 
// Ogni chiave dell'oggetto rappresenta una porzione
// dello stato globale, e il valore è il reducer corrispondente.

// Esportazione dello Store: Esportiamo lo store in modo 
// che possa essere utilizzato in altre parti dell'applicazione,
// come nel file principale.