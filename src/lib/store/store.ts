import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import declarationReducer from './slices/declarationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    declaration: declarationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
