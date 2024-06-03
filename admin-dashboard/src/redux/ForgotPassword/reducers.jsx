/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { ForgotPassword } from "./initialState";

const forgotPasswordSlice = createSlice({
    name: "ForgotPassword",
    initialState: ForgotPassword,
    reducers: {
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setSuccess, setMessage, setToken } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

