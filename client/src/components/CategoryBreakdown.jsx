import React from "react";
import { Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCategoryBreakdownQuery } from "@/features/api/transactionApi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
};

const CategoryBreakdownSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="animate-pulse space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-28 rounded bg-slate-100" />
          <div className="h-4 w-20 rounded bg-slate-100" />
        </div>
        <div className="h-2 rounded-full bg-slate-100" />
      </div>
    ))}
  </div>
);

const CategoryBreakdown = ({ filters, periodLabel = "All-time" }) => {
  const { data, isLoading, isError, refetch } =
    useGetCategoryBreakdownQuery(filters);

  const categories = data?.breakdown || [];
  const totalExpense = Number(data?.totalExpense) || 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Spending by category</CardTitle>
        <p className="text-sm text-slate-500">
          Expense categories for {periodLabel.toLowerCase()}.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CategoryBreakdownSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-red-500">
              Failed to load category spending.
            </p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : !categories.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Receipt className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-base font-medium text-slate-900">
              No expense categories yet
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Add an expense for {periodLabel.toLowerCase()} to see where your
              money is going.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((item) => {
              const totalAmount = Number(item.totalAmount) || 0;
              const percentage = totalExpense
                ? Math.round((totalAmount / totalExpense) * 100)
                : 0;
              const barWidth = totalAmount > 0 ? Math.max(percentage, 2) : 0;

              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {item.category}
                      </p>
                      <p className="text-xs text-slate-500">
                        {percentage}% of expenses
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-slate-100"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                    aria-label={`${item.category}: ${percentage}% of expenses`}
                  >
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
