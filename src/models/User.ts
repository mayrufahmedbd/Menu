import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'vendor' | 'admin' | 'superadmin';
  avatar?: string;
  phone?: string;
  walletBalance: number;
  rewardPoints: number;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  twoFASecret?: string;
  twoFAEnabled: boolean;
  addresses: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['customer', 'vendor', 'admin', 'superadmin'], default: 'customer' },
    avatar: { type: String },
    phone: { type: String },
    walletBalance: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    referralCode: { type: String, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    twoFASecret: { type: String },
    twoFAEnabled: { type: Boolean, default: false },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
