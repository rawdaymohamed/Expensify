import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";

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
import { useCreateTransactionMutation } from "@/features/api/transactionApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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

const getDefaultValues = () => ({
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
});

const AddTransaction = () => {
  const saveAndAddAnotherRef = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: getDefaultValues(),
  });

  const selectedType = watch("type");
  const selectedCategory = watch("category");

  const [createTransaction, { isLoading, error }] =
    useCreateTransactionMutation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const shouldAddAnother = saveAndAddAnotherRef.current;

    try {
      await createTransaction(data).unwrap();

      toast.success(
        `${data.type === "expense" ? "Expense recorded 💸" : "Income added 💰"}`,
      );

      if (shouldAddAnother) {
        reset(getDefaultValues());
        setFocus("amount");
        saveAndAddAnotherRef.current = false;
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Failed to create transaction:", err);

      toast.error(err?.data?.message || "Failed to save transaction");
      saveAndAddAnotherRef.current = false;
    }
  };
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
            <CardTitle className="text-2xl">Add Transaction</CardTitle>
            <CardDescription>
              Quickly record an expense or income.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, () => {
                saveAndAddAnotherRef.current = false;
              })}
              className="space-y-5"
            >
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
                    {...register("amount")}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label id="type-label">Type</Label>
                <input type="hidden" {...register("type")} />
                <div
                  className="grid grid-cols-2 rounded-lg border border-input bg-background p-1"
                  role="group"
                  aria-labelledby="type-label"
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
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
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
                    >
                      {category}
                    </Button>
                  ))}
                </div>
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

              <div className="space-y-2 pt-1">
                <Label htmlFor="note" className="text-slate-500">
                  Note <span className="font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Optional note"
                  rows={3}
                  className="bg-slate-50 text-sm"
                  {...register("note")}
                />
                {errors.note && (
                  <p className="text-sm text-red-500">{errors.note.message}</p>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-500">
                  {error?.data?.message || "Something went wrong"}
                </p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => {
                    saveAndAddAnotherRef.current = false;
                  }}
                >
                  {isLoading ? "Saving..." : "Save Transaction"}
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => {
                    saveAndAddAnotherRef.current = true;
                  }}
                >
                  Save and add another
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AddTransaction;
