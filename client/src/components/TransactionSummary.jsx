import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { useGetSummaryQuery } from "@/features/api/transactionApi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
};

const Stat = ({ icon, label, value, variant = "default" }) => (
  <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-white shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-md bg-slate-100 p-2 text-slate-700">{icon}</div>
      <div>
        <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      </div>
    </div>
    <Badge variant={variant}>{label}</Badge>
  </div>
);

const TransactionSummary = () => {
  const { data, isLoading, isError } = useGetSummaryQuery();

  const summary = data?.summary || { income: 0, expense: 0, balance: 0 };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3">
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : isError ? (
          <div className="text-sm text-red-500">Failed to load summary</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat
              icon={<ArrowUp className="h-5 w-5 text-green-600" />}
              label="Income"
              value={formatCurrency(summary.income)}
              variant="default"
            />

            <Stat
              icon={<ArrowDown className="h-5 w-5 text-red-600" />}
              label="Expense"
              value={formatCurrency(summary.expense)}
              variant="destructive"
            />

            <Stat
              icon={<DollarSign className="h-5 w-5 text-slate-700" />}
              label="Balance"
              value={formatCurrency(summary.balance)}
              variant="default"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
