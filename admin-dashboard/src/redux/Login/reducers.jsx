/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { UserLoginDetails } from "./initialState";

export const loginDetailsForUserSlice = createSlice({
  name: "LoginDetailsForUserSlice",
  initialState: UserLoginDetails,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
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
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setIsAuthenticated,
  setLoading,
  setError,
  setMessage,
  setIsUpdated,
  setToken,
  setUser,
} = loginDetailsForUserSlice.actions;

export default loginDetailsForUserSlice.reducer;
