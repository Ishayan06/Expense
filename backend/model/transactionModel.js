import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const creditCategories = ['Salary', 'Bonus', 'Refund'];
        const debitCategories = ['Food', 'Travel', 'Billing', 'Others'];
        
        if (this.type === 'credit') {
          return creditCategories.includes(value);
        } else if (this.type === 'debit') {
          return debitCategories.includes(value);
        }
        return false;
      },
      message: props => `Invalid category '${props.value}' for type '${props.instance.type}'`
    }
  },

  description: { type: String },

  timestamp: { type: Date, default: Date.now }

}, { timestamps: true });

const TransactionModel = mongoose.model("Transaction", transactionSchema);
export default TransactionModel;
