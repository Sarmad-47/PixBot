import mongoose from "mongoose";

const CreditSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    credits: Number, // credits available
    amount: Number, // amount spent
  },
  { timestamps: true }
);

const Credit = mongoose.models.Credit || mongoose.model("Credit", CreditSchema);
export default Credit;
