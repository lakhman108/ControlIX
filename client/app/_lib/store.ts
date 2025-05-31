import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import deviceReducer from "./slices/deviceSlice";
import { headerApi } from "./apis/apiHeaderSlice";
import { normalApi } from "./apis/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    [headerApi.reducerPath]: headerApi.reducer,
    [normalApi.reducerPath]: normalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(headerApi.middleware, normalApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
