import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("portfolio_admin_token") || "demo_admin_jwt_token_2026";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken,
    isAuthenticated: true, // Seamless admin experience for demo/testing
    user: JSON.parse(localStorage.getItem("portfolio_admin_user") || "null") || {
      fullName: "Kanhu Charan Sahoo",
      email: "kanhucharansahoo595@gmail.com",
      role: "Frontend Developer",
    },
    activeTab: "dashboard",
    toast: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("portfolio_admin_token", action.payload.token);
      localStorage.setItem("portfolio_admin_user", JSON.stringify(action.payload.user));
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("portfolio_admin_token");
      localStorage.removeItem("portfolio_admin_user");
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("portfolio_admin_user", JSON.stringify(state.user));
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  setUser,
  setActiveTab,
  setToast,
  clearToast,
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
