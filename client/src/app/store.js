import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { transactionApi } from "../features/api/transactionApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      transactionApi.middleware,
    ),
});
