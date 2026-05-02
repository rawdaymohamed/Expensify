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
      query: ({ page = 1, limit = 6, startDate, endDate } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        return `/transactions?${params.toString()}`;
      },
      providesTags: ["Transaction"],
    }),
    getSummary: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();

        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        const queryString = params.toString();
        return `/transactions/summary${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, transactionData }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction"],
    }),
    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useGetSummaryQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
  useGetTransactionByIdQuery,
} = transactionApi;
