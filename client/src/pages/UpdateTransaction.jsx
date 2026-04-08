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

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetching,
    isError,
    error: fetchError,
  } = useGetTransactionByIdQuery(id);

  const [updateTransaction, { isLoading: isUpdating, error: updateError }] =
    useUpdateTransactionMutation();

  const {
    register,
    handleSubmit,
    reset,
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
      <main className="min-h-screen bg-muted/30 px-4 py-6 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-none shadow-sm sm:border sm:shadow-md">
            <CardContent className="py-10">
              <p className="text-sm text-slate-500">Loading transaction...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-6 flex flex-col justify-center">
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
            <CardContent className="py-10">
              <p className="text-sm text-red-500">
                {fetchError?.data?.message || "Failed to load transaction"}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 flex flex-col justify-center">
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
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("type")}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  placeholder="Food, Salary, Transport..."
                  {...register("category")}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input id="date" type="date" {...register("date")} />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Optional note"
                  rows={4}
                  {...register("note")}
                />
                {errors.note && (
                  <p className="text-sm text-red-500">{errors.note.message}</p>
                )}
              </div>

              {updateError && (
                <p className="text-sm text-red-500">
                  {updateError?.data?.message || "Something went wrong"}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isUpdating}>
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
