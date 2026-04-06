import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    // req.body has been validated and sanitized by validate middleware
    const { amount, type, category, date, note } = req.body;

    // Ensure request is authenticated and use server-side user id only
    const userId = req.user && (req.user._id || req.user.id);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const transaction = await Transaction.create({
      user: userId,
      amount,
      type,
      category,
      date: date || Date.now(),
      note: note || "",
    });

    return res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createTransaction,
};
