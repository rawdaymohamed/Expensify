import Transaction from "../models/Transaction.js";

const buildDateFilter = ({ startDate, endDate }) => {
  const dateFilter = {};

  if (startDate) {
    const start = new Date(startDate);
    if (!Number.isNaN(start.getTime())) {
      dateFilter.$gte = start;
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }
  }

  return Object.keys(dateFilter).length ? dateFilter : null;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    const dateFilter = buildDateFilter(req.query);

    if (dateFilter) {
      query.date = dateFilter;
    }

    if (["income", "expense"].includes(req.query.type)) {
      query.type = req.query.type;
    }

    if (req.query.q && req.query.q.trim()) {
      const searchRegex = new RegExp(escapeRegex(req.query.q.trim()), "i");

      query.$or = [{ category: searchRegex }, { note: searchRegex }];
    }

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

    const match = { user: userId };
    const dateFilter = buildDateFilter(req.query);

    if (dateFilter) {
      match.date = dateFilter;
    }

    const summary = await Transaction.aggregate([
      { $match: match },
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

export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const match = { user: userId, type: "expense" };
    const dateFilter = buildDateFilter(req.query);

    if (dateFilter) {
      match.date = dateFilter;
    }

    const breakdown = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);

    const totalExpense = breakdown.reduce(
      (total, item) => total + item.totalAmount,
      0,
    );

    return res.status(200).json({ breakdown, totalExpense });
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
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
  getCategoryBreakdown,
};
