import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  filteredProducts: [],

  category: "all",
  price: "all",
  searchQuery: "",
  sortBy: "default",

  loading: true,
  error: null,
};

const applyFilters = (state) => {
  let filtered = state.products.filter((product) => {
    const categoryMatch =
      state.category === "all" || product.category === state.category;

    const productPrice = Number(product.price || 0);

    const priceMatch =
      state.price === "all" ||
      (state.price === "0-30" && productPrice >= 0 && productPrice <= 30) ||
      (state.price === "31-60" && productPrice > 30 && productPrice <= 60) ||
      (state.price === "61-100" && productPrice > 60 && productPrice <= 100);

    const title = String(product.title || "").toLowerCase();

    const searchQuery = state.searchQuery.trim().toLowerCase();

    const searchMatch = title.includes(searchQuery);

    return categoryMatch && priceMatch && searchMatch;
  });

  switch (state.sortBy) {
    case "price-low":
      filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;

    case "price-high":
      filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;

    case "rating":
      filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;

    default:
      break;
  }

  state.filteredProducts = filtered;
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];

      state.loading = false;
      state.error = null;

      applyFilters(state);
    },

    addProduct: (state, action) => {
      if (!action.payload) return;

      state.products.unshift(action.payload);

      applyFilters(state);
    },

    updateProduct: (state, action) => {
      if (!action.payload?.id) return;

      const index = state.products.findIndex(
        (product) => String(product.id) === String(action.payload.id),
      );

      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload,
        };
      }

      applyFilters(state);
    },

    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => String(product.id) !== String(action.payload),
      );

      applyFilters(state);
    },

    setProductsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProductsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearProductsError: (state) => {
      state.error = null;
    },

    setCategory: (state, action) => {
      state.category = action.payload;

      applyFilters(state);
    },

    setPrice: (state, action) => {
      state.price = action.payload;

      applyFilters(state);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;

      applyFilters(state);
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;

      applyFilters(state);
    },

    clearFilters: (state) => {
      state.category = "all";
      state.price = "all";
      state.searchQuery = "";
      state.sortBy = "default";

      applyFilters(state);
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,

  setProductsLoading,
  setProductsError,
  clearProductsError,

  setCategory,
  setPrice,
  setSearchQuery,
  setSortBy,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
