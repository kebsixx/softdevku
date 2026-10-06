"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "softdevku-cart";
const EMPTY_CART = [];

let cachedRaw = null;
let cachedValue = EMPTY_CART;
const listeners = new Set();

function readCart() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;

  cachedRaw = raw;
  try {
    cachedValue = raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    cachedValue = EMPTY_CART;
  }
  return cachedValue;
}

function writeCart(next) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cachedRaw = JSON.stringify(next);
  cachedValue = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function CartProvider({ children }) {
  const cart = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const addToCart = useCallback((product) => {
    const items = readCart();
    const exists = items.some((item) => item._id === product._id);
    writeCart(
      exists
        ? items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...items,
            {
              _id: product._id,
              title: product.title,
              price: product.price,
              image: product.image,
              category: product.category,
              quantity: 1,
            },
          ],
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    writeCart(readCart().filter((item) => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, type) => {
    writeCart(
      readCart()
        .map((item) => {
          if (item._id !== productId) return item;
          const quantity =
            type === "inc" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => writeCart(EMPTY_CART), []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return context;
}

export { CartProvider, useCart };
