/* eslint-disable no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";

// reducer
import loginDetailsForUserReducer from "./Login/reducers";
import forgotPasswordForUserReducer from "./ForgotPassword/reducers";
import resetPasswordForUserReducer from "./ResetPassword/reducers";

// initialState
import { UserLoginDetails } from "./Login/initialState";
import { ForgotPassword } from "./ForgotPassword/initialState";
import { ResetPassword } from "./ResetPassword/initialState";

export const RootState = {
  loginDetailsForUserState: UserLoginDetails,
  forgotPasswordForUserState: ForgotPassword,
  resetPasswordForUserState: ResetPassword,
};

export const store = configureStore({
  reducer: {
    loginDetailsForUserState: loginDetailsForUserReducer,
    forgotPasswordForUserState: forgotPasswordForUserReducer,
    resetPasswordForUserState: resetPasswordForUserReducer,

  },
});
