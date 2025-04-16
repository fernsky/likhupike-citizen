import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { registrationReducer } from "./slices/registrationSlice";
import { authReducer } from './slices/authSlice';
import { profileReducer } from './slices/profileSlice';
import { uiReducer } from './slices/uiSlice';
import { municipalityReducer } from './slices/municipalitySlice';
import { citizenApi } from './services/citizenApi';
import { authApi } from './services/authApi';
import { locationApi } from './services/locationApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ui: uiReducer,
    registration: registrationReducer,
    municipality: municipalityReducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      citizenApi.middleware,
      authApi.middleware,
      locationApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

// Set up listeners for RTK Query
setupListeners(store.dispatch);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define hooks with types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
