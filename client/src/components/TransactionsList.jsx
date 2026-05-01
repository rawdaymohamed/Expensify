import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import {
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
} from "@/features/api/transactionApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TransactionSummary from "@/components/TransactionSummary";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const typeBadgeStyles = {
  income: "border-green-200 bg-green-50 text-green-700",
  expense: "border-red-200 bg-red-50 text-red-700",
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

const TransactionListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="border border-slate-200 shadow-sm">
        <CardContent className="px-4">
          <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-32 rounded bg-slate-100" />
                <div className="h-5 w-16 rounded-full bg-slate-100" />
              </div>
              <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
              <div className="mt-4 h-4 w-full max-w-sm rounded bg-slate-100" />
            </div>
            <div className="h-6 w-28 rounded bg-slate-100 sm:ml-4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TransactionItem = ({ transaction, onDelete, isDeleting }) => {
  const isExpense = transaction.type === "expense";
  const navigate = useNavigate();
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
      <CardContent className="px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* LEFT */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-lg font-semibold leading-tight text-slate-950">
                {transaction.category}
              </h4>
              <Badge
                variant="outline"
                className={`capitalize ${typeBadgeStyles[transaction.type]}`}
              >
                {transaction.type}
              </Badge>
            </div>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {formatDate(transaction.date)}
            </p>

            {transaction.note ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {transaction.note}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">No note</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
            <p
              className={`text-xl font-bold leading-tight sm:text-right ${
                isExpense ? "text-red-600" : "text-green-600"
              }`}
            >
              {isExpense ? "-" : "+"}
              {formatCurrency(transaction.amount)}
            </p>
            <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction._id)}
                disabled={isDeleting}
                className="gap-1 text-slate-500 hover:text-red-600"
                aria-label={`Delete ${transaction.category} transaction`}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate(`/update-transaction/${transaction._id}`)
                }
                className="gap-1 text-slate-500 hover:text-blue-600"
                aria-label={`Edit ${transaction.category} transaction`}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading, isError, error, refetch } =
    useGetTransactionsQuery({
      page,
      limit,
    });

  const transactions = data?.transactions || [];
  const pages = data?.pages || 1;
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id).unwrap();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Failed to delete transaction:", error);
    }
  };
  if (isLoading) {
    return (
      <div>
        <TransactionSummary />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionListSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <TransactionSummary />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-red-500">
                {error?.data?.message || "Failed to load transactions."}
              </p>
              <Button variant="outline" size="sm" onClick={refetch}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div>
        <TransactionSummary />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <Button
                onClick={() => navigate("/add-transaction")}
                className="hidden md:inline-flex rounded-full bg-black text-white hover:bg-black/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
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
            <Button
              onClick={() => navigate("/add-transaction")}
              className="mt-5 rounded-full bg-black text-white hover:bg-black/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <TransactionSummary />
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent Transactions
        </h2>

        <Button
          onClick={() => navigate("/add-transaction")}
          className="hidden md:inline-flex rounded-full bg-black text-white hover:bg-black/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction._id}
            transaction={transaction}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      <PaginationControls page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default TransactionsList;
