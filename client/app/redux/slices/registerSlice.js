import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
    name: "register",
    initialState: {
        user: null,
        isLoading: false,
        error: null
    },
    reducers: {
        registerStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.error = null;           
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    }
});

export const { registerStart, registerSuccess, registerFailure } = registerSlice.actions;
export default registerSlice.reducer;