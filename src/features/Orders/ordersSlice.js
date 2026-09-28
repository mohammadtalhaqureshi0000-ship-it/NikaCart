import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    setOrders: (state, action) => {
      state.orders = Array.isArray(action.payload) ? action.payload : [];

      state.loading = false;
      state.error = null;
    },

    placeOrder: (state, action) => {
      if (!action.payload) {
        return;
      }

      const exists = state.orders.some(
        (order) => String(order.id) === String(action.payload.id),
      );

      if (!exists) {
        state.orders.unshift(action.payload);
      }

      state.error = null;
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;

      const order = state.orders.find(
        (item) => String(item.id) === String(orderId),
      );

      if (order) {
        order.status = status;
      }
    },

    setOrdersLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOrdersError: (state, action) => {
      state.error = action.payload;

      state.loading = false;
    },

    clearOrdersError: (state) => {
      state.error = null;
    },

    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setOrders,
  placeOrder,
  updateOrderStatus,
  setOrdersLoading,
  setOrdersError,
  clearOrdersError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
