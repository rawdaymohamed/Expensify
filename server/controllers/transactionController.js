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
export default {
  createTransaction,
  getTransactions,
};
