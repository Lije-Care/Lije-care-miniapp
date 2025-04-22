import { configureStore } from "@reduxjs/toolkit";
import specialistReducer from '@/redux/slices/specialistSlice';
import parentReducer from "@/redux/slices/itemSlice";
import childReducer from "@/redux/slices/childSlice";
import articlesReducer from "@/redux/slices/articlesSlice";
export const store = configureStore({
  reducer: {
   
    parent: parentReducer,
    children: childReducer,
    articles: articlesReducer,
    specialists: specialistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
