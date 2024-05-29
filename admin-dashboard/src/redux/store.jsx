/* eslint-disable no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";

// reducer
import loginDetailsForUserReducer from "./Login/reducers";

// initialState
import { UserLoginDetails } from "./Login/initialState";

export const RootState = {
  loginDetailsForUserState: UserLoginDetails,
};

export const store = configureStore({
  reducer: {
    loginDetailsForUserState: loginDetailsForUserReducer,
  },
});
