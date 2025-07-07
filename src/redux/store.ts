import { configureStore } from "@reduxjs/toolkit";
import specialistReducer from '@/redux/slices/specialistSlice';
import parentReducer from "@/redux/slices/itemSlice";
import childReducer from "@/redux/slices/childSlice";
import articlesReducer from "@/redux/slices/articlesSlice";
import notificationReducer from "@/redux/slices/notificationSlice";
export const store = configureStore({
  reducer: {
   
    parent: parentReducer,
    children: childReducer,
    articles: articlesReducer,
    specialists: specialistReducer,
    notificartions: notificationReducer, // Assuming you meant to use the same reducer for notifications
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
