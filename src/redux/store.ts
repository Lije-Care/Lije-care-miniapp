import { configureStore } from "@reduxjs/toolkit";
import specialistReducer from "@/redux/slices/specialistSlice";
import parentReducer from "@/redux/slices/itemSlice";
import childReducer from "@/redux/slices/childSlice";
import articlesReducer from "@/redux/slices/articlesSlice";
import notificationReducer from "@/redux/slices/notificationSlice";
import cartReducer from "./slices/cartSlice";

// Load cart state from localStorage if exists
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn("Failed to load cart state from localStorage:", err);
    return undefined;
  }
};

// Save cart state to localStorage
const saveCartState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.warn("Failed to save cart state to localStorage:", err);
  }
};

const preloadedCartState = loadCartState();

export const store = configureStore({
  reducer: {
    parent: parentReducer,
    children: childReducer,
    articles: articlesReducer,
    cart: cartReducer,
    specialists: specialistReducer,
    notificartions: notificationReducer,
  },
  // Inject persisted cart state into preloadedState
  preloadedState: {
    cart: preloadedCartState,
  },
});

// Subscribe to store changes to save cart slice on update
store.subscribe(() => {
  saveCartState(store.getState().cart);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
