/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { UserLoginDetails } from "./initialState";

export const loginDetailsForUserSlice = createSlice({
  name: "LoginDetailsForUserSlice",
  initialState: UserLoginDetails,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setIsUpdated: (state, action) => {
      state.isUpdated = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const {
  setLoading,
  setUser,
  setIsAuthenticated,
  setError,
  setMessage,
  setIsUpdated,
  setEmail,
  setPassword,
} = loginDetailsForUserSlice.actions;

export default loginDetailsForUserSlice.reducer;
