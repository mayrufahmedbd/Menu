import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
