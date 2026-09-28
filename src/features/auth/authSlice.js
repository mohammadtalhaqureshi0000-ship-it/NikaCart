
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  currentUser: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentUser,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  setUsers,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;