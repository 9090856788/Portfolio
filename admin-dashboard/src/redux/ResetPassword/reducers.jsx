/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { ResetPassword } from "./initialState";

const resetPasswordSlice = createSlice({
    name: "Reset Password",
    initialState: ResetPassword,
    reducers: {
        setNewPassword: (state, action) => {
            state.newPassword = action.payload;
        },
        setConfirmPassword: (state, action) => {
            state.confirmNewPassword = action.payload;
        }
    }
});

export const { setNewPassword, setConfirmPassword } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;