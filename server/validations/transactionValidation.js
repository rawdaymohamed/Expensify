import { z } from "zod";

export const addTransactionSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (typeof val === "string") return val.trim() === "" ? NaN : Number(val);
      return val;
    },
    z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .refine((n) => n > 0, { message: "Amount must be greater than 0" }),
  ),

  type: z.enum(["income", "expense"], { required_error: "Type is required" }),

  category: z.string().trim().min(1, "Category is required"),

  date: z.preprocess((val) => {
    if (!val) return undefined;

    const parsedDate = val instanceof Date ? val : new Date(val);

    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }, z.date().optional()),

  note: z.string().trim().optional().default(""),
});

export default addTransactionSchema;
