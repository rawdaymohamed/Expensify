import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL;

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  tagTypes: ["Transaction"],
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "/transactions",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    getTransactions: builder.query({
      query: ({ page = 1, limit = 6 } = {}) =>
        `/transactions?page=${page}&limit=${limit}`,
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useCreateTransactionMutation, useGetTransactionsQuery } =
  transactionApi;
