import TransactionModel from "../model/transactionModel.js";
import userModel from "../model/userModel.js";

// Route: GET /api/transactions/summary
export const getTransactionModelSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("name email");
    const transactions = await TransactionModel.find({ userId });

    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((txn) => {
      if (txn.type === "credit") totalCredit += txn.amount;
      else if (txn.type === "debit") totalDebit += txn.amount;
    });

    const balance = totalCredit - totalDebit;

    res.json({
      success: true,
      user,
      transactions,
      totalCredit,
      totalDebit,
      balance,
    });
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Route: GET /api/transactions/monthly-summary
export const getMonthlySummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await TransactionModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            month: { $month: "$timestamp" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          values: {
            $push: {
              k: "$_id.type",
              v: "$total",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          data: { $arrayToObject: "$values" },
        },
      },
      {
        $sort: { month: 1 }
      }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formatted = result.map(item => ({
      name: months[item.month - 1],
      income: item.data.credit || 0,
      expense: item.data.debit || 0
    }));

    res.json({ success: true, data: formatted });

  } catch (error) {
    console.error("Error in getMonthlySummary", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addCredit=async(req,res)=>{
  try {
    const {amount,category,description}=req.body;
    const creditTransaction=await TransactionModel.create({
      userId:req.user.id,
      type:'credit',
      amount,
      category,
      description,
    });
    res.status(201).json({ success: true, data: creditTransaction });

  } catch (error) {
     console.error("Add credit error:", error);
    res.status(500).json({ success: false, message: "Failed to add credit" });
  }
}

export const addDebit=async(req,res)=>{
  try {
    const {amount,category,description}=req.body;
    const debitTransaction=await TransactionModel.create({
      userId:req.user.id,
      type:'debit',
      amount,
      category,
      description,
    });
    res.status(201).json({ success: true, data: debitTransaction });
    
  } catch (error) {
     console.error("Add credit error:", error);
    res.status(500).json({ success: false, message: "Failed to add credit" });
  }
}




export const deleteData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await TransactionModel.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    await TransactionModel.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
