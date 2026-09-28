
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.wishlistItems.find(
        (item) => item.id === action.payload.id
      );

      if (!existingItem) {
        state.wishlistItems.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
    },

    setWishlistItems: (state, action) => {
      state.wishlistItems = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistItems,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;