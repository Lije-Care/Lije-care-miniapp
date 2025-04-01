import { configureStore } from "@reduxjs/toolkit";

import parentReducer from "@/redux/slices/itemSlice"
import childReducer from "@/redux/slices/childSlice"
export const store = configureStore({
  reducer: {
   
    parent: parentReducer,
    children: childReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
