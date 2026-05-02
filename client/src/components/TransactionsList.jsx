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
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Search,
} from "lucide-react";
import {
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
} from "@/features/api/transactionApi";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CategoryBreakdown from "@/components/CategoryBreakdown";
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

const typeMeta = {
  income: {
    Icon: TrendingUp,
    label: "Income",
    amountClass: "text-green-600",
    sign: "+",
  },
  expense: {
    Icon: TrendingDown,
    label: "Expense",
    amountClass: "text-red-600",
    sign: "-",
  },
};

const formatDateParam = (date) => date.toISOString().split("T")[0];

const getPeriodRange = (period) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (period === "thisMonth") {
    return {
      startDate: formatDateParam(
        new Date(today.getFullYear(), today.getMonth(), 1),
      ),
      endDate: formatDateParam(startOfToday),
      label: "This month",
    };
  }

  if (period === "lastMonth") {
    return {
      startDate: formatDateParam(
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
      ),
      endDate: formatDateParam(new Date(today.getFullYear(), today.getMonth(), 0)),
      label: "Last month",
    };
  }

  if (period === "last30") {
    const startDate = new Date(startOfToday);
    startDate.setDate(startDate.getDate() - 29);

    return {
      startDate: formatDateParam(startDate),
      endDate: formatDateParam(startOfToday),
      label: "Last 30 days",
    };
  }

  return { label: "All-time" };
};

const periodOptions = [
  { value: "all", label: "All-time" },
  { value: "thisMonth", label: "This month" },
  { value: "last30", label: "Last 30 days" },
  { value: "lastMonth", label: "Last month" },
];

const typeFilterOptions = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const PeriodFilter = ({ selectedPeriod, onPeriodChange }) => (
  <div className="mb-4 flex flex-wrap gap-2">
    {periodOptions.map((option) => (
      <Button
        key={option.value}
        type="button"
        variant={selectedPeriod === option.value ? "secondary" : "outline"}
        size="sm"
        onClick={() => onPeriodChange(option.value)}
        aria-pressed={selectedPeriod === option.value}
        className="rounded-lg"
      >
        {option.label}
      </Button>
    ))}
  </div>
);

const TransactionFilters = ({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
}) => (
  <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search category or note"
        className="h-9 pl-9"
        aria-label="Search transactions by category or note"
      />
    </div>
    <div
      className="grid grid-cols-3 rounded-lg border border-input bg-background p-1"
      role="group"
      aria-label="Filter transactions by type"
    >
      {typeFilterOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onTypeChange(option.value)}
          aria-pressed={selectedType === option.value}
          className={`rounded-md ${
            selectedType === option.value
              ? "bg-slate-100 text-slate-950 hover:bg-slate-100"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  </div>
);

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

const DeleteConfirmationModal = ({
  transaction,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  React.useEffect(() => {
    if (!transaction) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, transaction]);

  if (!transaction) return null;

  const meta = typeMeta[transaction.type] || typeMeta.expense;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-transaction-title"
        aria-describedby="delete-transaction-description"
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3
              id="delete-transaction-title"
              className="text-lg font-semibold text-slate-950"
            >
              Delete transaction?
            </h3>
            <p
              id="delete-transaction-description"
              className="mt-2 text-sm leading-6 text-slate-500"
            >
              This will permanently delete the {transaction.category}{" "}
              {meta.label.toLowerCase()} for{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(transaction.amount)}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction, onDelete, isDeleting }) => {
  const meta = typeMeta[transaction.type] || typeMeta.expense;
  const TypeIcon = meta.Icon;
  const navigate = useNavigate();
  return (
    <Card className="border border-slate-200 shadow-sm transition hover:shadow-md">
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
                <TypeIcon className="h-3 w-3" aria-hidden="true" />
                {meta.label}
              </Badge>
            </div>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {formatDate(transaction.date)}
            </p>

            {transaction.note ? (
              <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-slate-500">
                {transaction.note}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">No note</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
            <p
              className={`text-xl font-bold leading-tight sm:text-right ${meta.amountClass}`}
              aria-label={`${meta.label} amount ${formatCurrency(
                transaction.amount,
              )}`}
            >
              {meta.sign}
              {formatCurrency(transaction.amount)}
            </p>
            <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction)}
                disabled={isDeleting}
                className="gap-1 rounded-md text-slate-500 hover:text-red-600 focus-visible:ring-red-200"
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
                className="gap-1 rounded-md text-slate-500 hover:text-blue-600 focus-visible:ring-blue-200"
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
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const limit = 6;

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const periodRange = React.useMemo(
    () => getPeriodRange(selectedPeriod),
    [selectedPeriod],
  );
  const filters = React.useMemo(
    () => ({
      startDate: periodRange.startDate,
      endDate: periodRange.endDate,
    }),
    [periodRange.endDate, periodRange.startDate],
  );
  const queryArgs = React.useMemo(
    () => ({
      page,
      limit,
      ...filters,
      q: debouncedSearchTerm || undefined,
      type: selectedType === "all" ? undefined : selectedType,
    }),
    [debouncedSearchTerm, filters, page, selectedType],
  );
  const { data, isLoading, isError, error, refetch } =
    useGetTransactionsQuery(queryArgs);

  const transactions = data?.transactions || [];
  const pages = data?.pages || 1;
  const hasActiveTransactionFilters =
    Boolean(debouncedSearchTerm) || selectedType !== "all";
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleRequestDelete = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleCancelDelete = React.useCallback(() => {
    if (!isDeleting) {
      setTransactionToDelete(null);
    }
  }, [isDeleting]);

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete._id).unwrap();
      toast.success("Transaction deleted successfully");
      setTransactionToDelete(null);
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Failed to delete transaction:", error);
    }
  };
  if (isLoading) {
    return (
      <div>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        <TransactionSummary filters={filters} periodLabel={periodRange.label} />
        <CategoryBreakdown filters={filters} periodLabel={periodRange.label} />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={setSearchTerm}
              onTypeChange={handleTypeChange}
            />
            <TransactionListSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        <TransactionSummary filters={filters} periodLabel={periodRange.label} />
        <CategoryBreakdown filters={filters} periodLabel={periodRange.label} />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={setSearchTerm}
              onTypeChange={handleTypeChange}
            />
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
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        <TransactionSummary filters={filters} periodLabel={periodRange.label} />
        <CategoryBreakdown filters={filters} periodLabel={periodRange.label} />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <Button
                onClick={() => navigate("/add-transaction")}
                className="hidden md:inline-flex rounded-lg bg-black text-white hover:bg-black/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={setSearchTerm}
              onTypeChange={handleTypeChange}
            />
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Receipt className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-base font-medium text-slate-900">
                {hasActiveTransactionFilters
                  ? "No matching transactions"
                  : "No transactions yet"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {hasActiveTransactionFilters
                  ? "Try changing your search, type filter, or date range."
                  : `Add your first expense or income for ${periodRange.label.toLowerCase()}.`}
              </p>
              {!hasActiveTransactionFilters && (
                <Button
                  onClick={() => navigate("/add-transaction")}
                  className="mt-5 rounded-lg bg-black text-white hover:bg-black/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />
      <TransactionSummary filters={filters} periodLabel={periodRange.label} />
      <CategoryBreakdown filters={filters} periodLabel={periodRange.label} />
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent Transactions
        </h2>

        <Button
          onClick={() => navigate("/add-transaction")}
          className="hidden md:inline-flex rounded-lg bg-black text-white hover:bg-black/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      <TransactionFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        onSearchChange={setSearchTerm}
        onTypeChange={handleTypeChange}
      />
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction._id}
            transaction={transaction}
            onDelete={handleRequestDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      <PaginationControls page={page} pages={pages} onPageChange={setPage} />
      <DeleteConfirmationModal
        transaction={transactionToDelete}
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TransactionsList;
