import { configureStore, createSlice } from "@reduxjs/toolkit";

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    selectedCategory: "All",
    searchQuery: "",
    isMobileDrawerOpen: false,
    activeSection: "home",
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleMobileDrawer: (state) => {
      state.isMobileDrawerOpen = !state.isMobileDrawerOpen;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  toggleMobileDrawer,
  setActiveSection,
} = portfolioSlice.actions;

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice.reducer,
  },
});
