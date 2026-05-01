import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { useGetSummaryQuery } from "@/features/api/transactionApi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
};

const statBadgeStyles = {
  Income: "border-green-200 bg-green-50 text-green-700",
  Expense: "border-red-200 bg-red-50 text-red-700",
};

const BalanceStat = ({ value }) => (
  <div className="border-b border-slate-100 pb-5 sm:col-span-2">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <DollarSign className="h-4 w-4 text-slate-700" />
          <span>Balance</span>
        </div>
        <div className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {value}
        </div>
        <p className="mt-2 text-sm text-slate-500">All-time totals</p>
      </div>
    </div>
  </div>
);

const SecondaryStat = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3">
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
      <p className="mt-1 text-xs text-slate-400">All-time totals</p>
    </div>
    <Badge variant="outline" className={statBadgeStyles[label]}>
      {label}
    </Badge>
  </div>
);

const TransactionSummary = () => {
  const { data, isLoading, isError, refetch } = useGetSummaryQuery();

  const summary = data?.summary || { income: 0, expense: 0, balance: 0 };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Overview</CardTitle>
        <CardDescription>All-time totals from your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3">
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-start gap-3">
            <div className="text-sm text-red-500">Failed to load summary</div>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BalanceStat value={formatCurrency(summary.balance)} />

            <SecondaryStat
              icon={<ArrowUp className="h-5 w-5 text-green-600" />}
              label="Income"
              value={formatCurrency(summary.income)}
            />

            <SecondaryStat
              icon={<ArrowDown className="h-5 w-5 text-red-600" />}
              label="Expense"
              value={formatCurrency(summary.expense)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
