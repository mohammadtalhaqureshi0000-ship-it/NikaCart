const CART_KEY = (userId) => `nikaCart_cart_${userId}`;

const WISHLIST_KEY = (userId) => `nikaCart_wishlist_${userId}`;

const readStorage = (key, fallback) => {
  try {
    const savedData = localStorage.getItem(key);

    return savedData ? JSON.parse(savedData) : fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);

    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

export const loadState = (userId = null) => {
  if (!userId) {
    return {
      cart: {
        cartItems: [],
      },

      wishlist: {
        wishlistItems: [],
      },
    };
  }

  const cart = readStorage(CART_KEY(userId), {
    cartItems: [],
  });

  const wishlist = readStorage(WISHLIST_KEY(userId), {
    wishlistItems: [],
  });

  return {
    cart,
    wishlist,
  };
};

export const saveState = (state, userId = null) => {
  if (!userId) {
    return;
  }

  writeStorage(CART_KEY(userId), state.cart);

  writeStorage(WISHLIST_KEY(userId), state.wishlist);
};
