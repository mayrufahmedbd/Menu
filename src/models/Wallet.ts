import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITransaction {
  amount: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'rewards_credit' | 'payout';
  description: string;
  referenceId?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  rewardPoints: number;
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'rewards_credit', 'payout'],
    required: true,
  },
  description: { type: String, required: true },
  referenceId: String,
  createdAt: { type: Date, default: Date.now },
});

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;
