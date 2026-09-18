import { configureStore, createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("portfolio_admin_token");
const storedUser = JSON.parse(localStorage.getItem("portfolio_admin_user") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    // Authenticated if token exists or defaults to true for demo session
    isAuthenticated: Boolean(storedToken),
    user: storedUser || {
      fullName: "Kanhu Charan Sahoo",
      email: "kanhucharansahoo595@gmail.com",
      phone: "+91 9090856788",
      role: "Frontend Developer & UI/UX",
    },
    activeTab: "dashboard",
    // Auto-resizing / collapsible sidebar state
    isSidebarCollapsed: localStorage.getItem("portfolio_admin_sidebar_collapsed") === "true",
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
    toggleSidebarCollapsed: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
      localStorage.setItem("portfolio_admin_sidebar_collapsed", String(state.isSidebarCollapsed));
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
  toggleSidebarCollapsed,
  setToast,
  clearToast,
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
