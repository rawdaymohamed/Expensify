import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";
import requireAuth from "../middleware/requireAuth.js";
import validateId from "../middleware/validateId.js";
import addTransactionSchema from "../validations/transactionValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Get all transactions for authenticated user (protected)
router.get("/", requireAuth, getTransactions);

// Create a transaction (protected)
router.post(
  "/",
  requireAuth,
  validate(addTransactionSchema),
  createTransaction,
);
router.delete("/:id", requireAuth, validateId, deleteTransaction);
router.put(
  "/:id",
  requireAuth,
  validateId,
  validate(addTransactionSchema),
  updateTransaction,
);
export default router;
