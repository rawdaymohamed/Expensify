import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { addTransactionSchema } from "../validations/transactionSchema";
import {
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from "@/features/api/transactionApi";

const categoryOptions = [
  "Food",
  "Transport",
  "Rent",
  "Salary",
  "Shopping",
  "Bills",
];

const typeButtonStyles = {
  expense: {
    active: "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700",
    inactive: "text-slate-500 hover:text-slate-900",
  },
  income: {
    active:
      "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700",
    inactive: "text-slate-500 hover:text-slate-900",
  },
};

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const amountErrorId = "edit-amount-error";
  const typeErrorId = "edit-type-error";
  const categoryErrorId = "edit-category-error";
  const dateErrorId = "edit-date-error";
  const noteErrorId = "edit-note-error";
  const formErrorId = "edit-transaction-error";

  const {
    data,
    isLoading: isFetching,
    isError,
    error: fetchError,
    refetch,
  } = useGetTransactionByIdQuery(id);

  const [updateTransaction, { isLoading: isUpdating, error: updateError }] =
    useUpdateTransactionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      amount: "",
      type: "expense",
      category: "",
      date: "",
      note: "",
    },
  });

  const selectedType = watch("type");
  const selectedCategory = watch("category");

  React.useEffect(() => {
    if (data?.transaction) {
      reset({
        amount: data.transaction.amount?.toString() || "",
        type: data.transaction.type || "expense",
        category: data.transaction.category || "",
        date: data.transaction.date
          ? new Date(data.transaction.date).toISOString().split("T")[0]
          : "",
        note: data.transaction.note || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      await updateTransaction({
        id,
        transactionData: formData,
      }).unwrap();

      toast.success("Transaction updated successfully ✨");
      navigate("/");
    } catch (err) {
      console.error("Failed to update transaction:", err);
      toast.error(err?.data?.message || "Failed to update transaction");
    }
  };

  if (isFetching) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-none shadow-sm sm:border sm:shadow-md">
            <CardHeader className="space-y-1">
              <div className="h-7 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="h-11 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="h-24 w-full animate-pulse rounded-lg bg-slate-100" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Card className="border-none shadow-sm sm:border sm:shadow-md">
            <CardContent className="flex flex-col items-start gap-3 py-10">
              <p className="text-sm text-red-500">
                {fetchError?.data?.message || "Failed to load transaction"}
              </p>
              <Button variant="outline" size="sm" onClick={refetch}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card className="border-none shadow-sm sm:border sm:shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit Transaction</CardTitle>
            <CardDescription>
              Update your expense or income details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    autoFocus
                    className="h-11 pl-7 text-lg font-semibold"
                    aria-invalid={Boolean(errors.amount)}
                    aria-describedby={
                      errors.amount ? amountErrorId : undefined
                    }
                    {...register("amount")}
                  />
                </div>
                {errors.amount && (
                  <p id={amountErrorId} className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label id="edit-type-label">Type</Label>
                <input type="hidden" {...register("type")} />
                <div
                  className="grid grid-cols-2 rounded-lg border border-input bg-background p-1"
                  role="group"
                  aria-labelledby="edit-type-label"
                  aria-describedby={errors.type ? typeErrorId : undefined}
                >
                  {["expense", "income"].map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setValue("type", type, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      aria-pressed={selectedType === type}
                      className={`capitalize ${
                        selectedType === type
                          ? typeButtonStyles[type].active
                          : typeButtonStyles[type].inactive
                      } focus-visible:ring-slate-300`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                {errors.type && (
                  <p id={typeErrorId} className="text-sm text-red-500">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  placeholder="Food, Salary, Transport..."
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? categoryErrorId : undefined
                  }
                  {...register("category")}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {categoryOptions.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={
                        selectedCategory === category ? "secondary" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setValue("category", category, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      aria-pressed={selectedCategory === category}
                      className="rounded-lg focus-visible:ring-slate-300"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                {errors.category && (
                  <p id={categoryErrorId} className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? dateErrorId : undefined}
                    {...register("date")}
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.date && (
                  <p id={dateErrorId} className="text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <Label htmlFor="note" className="text-slate-500">
                  Note <span className="font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Optional note"
                  rows={3}
                  className="bg-slate-50 text-sm"
                  aria-invalid={Boolean(errors.note)}
                  aria-describedby={errors.note ? noteErrorId : undefined}
                  {...register("note")}
                />
                {errors.note && (
                  <p id={noteErrorId} className="text-sm text-red-500">
                    {errors.note.message}
                  </p>
                )}
              </div>

              {updateError && (
                <p id={formErrorId} className="text-sm text-red-500">
                  {updateError?.data?.message || "Something went wrong"}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isUpdating}
                aria-describedby={updateError ? formErrorId : undefined}
              >
                {isUpdating ? "Updating..." : "Update Transaction"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UpdateTransaction;
