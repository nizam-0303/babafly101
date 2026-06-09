import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import filterReducer from './slices/filterSlice';
import flightReducer from './slices/flightSlice';

export const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer, filter: filterReducer, flight: flightReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
