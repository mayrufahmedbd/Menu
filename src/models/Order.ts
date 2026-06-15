import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId | string;
    title: string;
    quantity: number;
    price: number;
    vendor?: mongoose.Types.ObjectId | string;
  }[];
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'COD' | 'SSLCOMMERZ' | 'STRIPE' | 'PAYPAL' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'BANK_TRANSFER';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Returned';
  timeline: {
    status: string;
    notes?: string;
    updatedAt: Date;
  }[];
  shippingProvider?: string;
  trackingNumber?: string;
  shippingCost: number;
  discountAmount: number;
  couponApplied?: string;
  totalAmount: number;
  vendorPayouts: {
    vendor: mongoose.Types.ObjectId | string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Refunded';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    items: [
      {
        product: { type: Schema.Types.Mixed, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        vendor: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    shippingDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'SSLCOMMERZ', 'STRIPE', 'PAYPAL', 'BKASH', 'NAGAD', 'ROCKET', 'BANK_TRANSFER'],
      required: true,
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Returned'],
      default: 'Pending',
    },
    timeline: [
      {
        status: { type: String, required: true },
        notes: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    shippingProvider: String,
    trackingNumber: String,
    shippingCost: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponApplied: String,
    totalAmount: { type: Number, required: true },
    vendorPayouts: [
      {
        vendor: { type: Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
      },
    ],
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
