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

const TransactionItem = ({ transaction, onDelete, isDeleting }) => {
  const isExpense = transaction.type === "expense";
  const navigate = useNavigate();
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-4">
          {/* LEFT */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
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
              <p className="mt-2 text-sm text-slate-600">{transaction.note}</p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">No note</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end justify-between gap-3">
            <p
              className={`text-lg font-semibold ${
                isExpense ? "text-red-600" : "text-green-600"
              }`}
            >
              {isExpense ? "-" : "+"}
              {formatCurrency(transaction.amount)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="large"
                onClick={() => onDelete(transaction._id)}
                disabled={isDeleting}
                className="text-slate-500 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={() =>
                  navigate(`/update-transaction/${transaction._id}`)
                }
                className="text-slate-500 hover:text-blue-600"
              >
                <Edit className="h-4 w-4" />
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
  const { data, isLoading, isError, error } = useGetTransactionsQuery({
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
            <p className="text-sm text-slate-500">Loading transactions...</p>
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
            <p className="text-sm text-red-500">
              {error?.data?.message || "Failed to load transactions."}
            </p>
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
