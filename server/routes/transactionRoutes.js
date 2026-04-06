import express from "express";
import { createTransaction } from "../controllers/transactionController.js";
import requireAuth from "../middleware/requireAuth.js";
import addTransactionSchema from "../validations/transactionValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Create a transaction (protected)
router.post("/", requireAuth, validate(addTransactionSchema), createTransaction);

export default router;
