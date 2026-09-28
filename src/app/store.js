import { configureStore } from "@reduxjs/toolkit";

import productReducer from "../features/Product/productSlice";

import cartReducer, { setCartItems } from "../features/Cart/cartSlice";

import wishlistReducer, {
  setWishlistItems,
} from "../features/Wishlist/wishlistSlice";

import orderReducer, { clearOrders } from "../features/Orders/ordersSlice";

import authReducer from "../features/auth/authSlice";

import { loadState, saveState } from "../redux/localStorage";

const initialAuth = {
  users: [],
  currentUser: null,
  loading: true,
  error: null,
};

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    auth: authReducer,
  },

  preloadedState: {
    auth: initialAuth,
  },
});

let activeUserId = null;
let switchingUser = false;

const persistCurrentState = () => {
  if (!activeUserId) {
    return;
  }

  const state = store.getState();

  saveState(
    {
      cart: state.cart,
      wishlist: state.wishlist,
    },
    activeUserId,
  );
};

store.subscribe(() => {
  if (switchingUser) {
    return;
  }

  const state = store.getState();

  const nextUserId = state.auth.currentUser?.id || null;

  if (nextUserId !== activeUserId) {
    persistCurrentState();

    activeUserId = nextUserId;

    switchingUser = true;

    try {
      if (activeUserId) {
        const savedState = loadState(activeUserId);

        store.dispatch(setCartItems(savedState.cart?.cartItems || []));

        store.dispatch(
          setWishlistItems(savedState.wishlist?.wishlistItems || []),
        );
      } else {
        store.dispatch(setCartItems([]));

        store.dispatch(setWishlistItems([]));
      }

      store.dispatch(clearOrders());
    } finally {
      switchingUser = false;
    }
  }

  persistCurrentState();
});

export default store;
