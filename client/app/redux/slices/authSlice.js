import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    access_token:
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.error = null;
      localStorage.setItem("access_token", action.payload.access_token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.error = null;
      localStorage.removeItem("access_token");
    },
    //logout ancora da mettere in qualche componente per poter effettuare
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
