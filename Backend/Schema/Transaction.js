import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true
  },

  amount: { type: Number, required: true },

  date: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
