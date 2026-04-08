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

    return res
      .status(201)
      .json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);

    const query = { user: userId };

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Transaction.countDocuments(query),
    ]);

    return res.status(200).json({
      transactions,
      page,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const transactionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const transactionId = req.params.id;
    const { amount, type, category, date, note } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      { amount, type, category, date, note },
      { new: true },
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res
      .status(200)
      .json({ message: "Transaction updated", transaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const transactionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const summary = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const result = summary.reduce(
      (acc, item) => {
        if (item._id === "income") {
          acc.income = item.totalAmount;
        } else if (item._id === "expense") {
          acc.expense = item.totalAmount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );
    result.balance = result.income - result.expense;
    return res.status(200).json({ summary: result });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export default {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getTransactionById,
  getSummary,
};
