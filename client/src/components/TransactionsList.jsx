import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, ArrowLeft, ArrowRight } from "lucide-react";
import { useGetTransactionsQuery } from "@/features/api/transactionApi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const PaginationControls = ({ page, pages, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{pages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="gap-2"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TransactionItem = ({ transaction }) => {
  const isExpense = transaction.type === "expense";

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-base font-semibold text-slate-900">
                {transaction.category}
              </h4>
              <Badge variant={isExpense ? "destructive" : "default"}>
                {transaction.type}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {formatDate(transaction.date)}
            </p>

            {transaction.note ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {transaction.note}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-slate-400">No note</p>
            )}
          </div>

          <div className="shrink-0">
            <p
              className={`text-lg font-bold ${
                isExpense ? "text-red-600" : "text-green-600"
              }`}
            >
              {isExpense ? "-" : "+"}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionsList = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, error } = useGetTransactionsQuery({
    page,
    limit,
  });

  const transactions = data?.transactions || [];
  const pages = data?.pages || 1;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            {error?.data?.message || "Failed to load transactions."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions.length) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Receipt className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-base font-medium text-slate-900">
            No transactions yet
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first expense or income to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-xl mb-4">Recent Transactions</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id} transaction={transaction} />
        ))}
      </div>

      <PaginationControls page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default TransactionsList;
