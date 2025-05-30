import { createSlice } from "@reduxjs/toolkit";

const editSlice = createSlice({
    name: "edit",
    initialState: {
        trasporto: {
            data: null,
            isLoading: false,
            error: null,
        },
        utente: {
            data: null,
            isLoading: false,
            error: null,
        },
    },
    reducers: {
        // Trasporto
        editTrasportoStart: (state) => {
            state.trasporto.isLoading = true;
            state.trasporto.error = null;
        },
        editTrasportoSuccess: (state, action) => {
            state.trasporto.isLoading = false;
            state.trasporto.data = action.payload;
            state.trasporto.error = null;
        },
        editTrasportoFailure: (state, action) => {
            state.trasporto.isLoading = false;
            state.trasporto.error = action.payload;
        },
        
        // Utente
        editUtenteStart: (state) => {
            state.utente.isLoading = true;
            state.utente.error = null;
        },
        editUtenteSuccess: (state, action) => {
            state.utente.isLoading = false;
            state.utente.data = action.payload;
            state.utente.error = null;
        },
        editUtenteFailure: (state, action) => {
            state.utente.isLoading = false;
            state.utente.error = action.payload;
        },
    },
});

export const { 
    editTrasportoStart, 
    editTrasportoSuccess, 
    editTrasportoFailure, 
    editUtenteStart, 
    editUtenteSuccess, 
    editUtenteFailure 
} = editSlice.actions;

export default editSlice.reducer;
