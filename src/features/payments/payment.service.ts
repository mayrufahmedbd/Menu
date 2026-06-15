import Order from '@/models/Order';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import connectToDatabase from '@/lib/db';

export class PaymentService {
  /**
   * Simulates payment gateway redirection or session creation.
   * In a live app, this connects to Stripe Checkout or bKash API.
   */
  static async createPaymentSession(
    orderId: string,
    method: string
  ): Promise<{ redirectUrl: string; transactionId: string }> {
    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Return a mock redirect URL that will let the client simulate the checkout outcome
    const redirectUrl = `/mock-payment?orderId=${orderId}&method=${method}&txnId=${transactionId}`;

    return { redirectUrl, transactionId };
  }

  /**
   * Simulates a webhook transaction verification.
   * Updates order payment status, order tracking timeline, and processes loyalty points rewards.
   */
  static async processPaymentSuccess(orderId: string, transactionId: string): Promise<boolean> {
    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) return false;

    if (order.paymentStatus === 'Paid') return true; // Already processed

    // 1. Update order payment status
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.trackingNumber = transactionId;
    order.timeline.push({
      status: 'Confirmed',
      notes: `Payment verified successfully via ${order.paymentMethod}. Transaction ID: ${transactionId}`,
      updatedAt: new Date(),
    });

    await order.save();

    // 2. Award loyalty points to user if registered
    if (order.user) {
      const user = await User.findById(order.user);
      if (user) {
        // 1 point for every 100 BDT spent
        const pointsAwarded = Math.floor(order.totalAmount / 100);
        user.rewardPoints += pointsAwarded;
        await user.save();

        // Register transaction in user wallet
        const wallet = await Wallet.findOne({ user: user._id });
        if (wallet) {
          wallet.balance = user.walletBalance; // Sync if out
          wallet.transactions.push({
            amount: pointsAwarded,
            type: 'rewards_credit',
            description: `Earned reward points for order #${order._id.toString().substring(18)}`,
            referenceId: order._id.toString(),
            createdAt: new Date(),
          });
          await wallet.save();
        } else {
          await Wallet.create({
            user: user._id,
            balance: 0,
            rewardPoints: pointsAwarded,
            transactions: [
              {
                amount: pointsAwarded,
                type: 'rewards_credit',
                description: `Earned reward points for order #${order._id.toString().substring(18)}`,
                referenceId: order._id.toString(),
                createdAt: new Date(),
              },
            ],
          });
        }
      }
    }

    return true;
  }

  /**
   * Simulates a failed payment transaction.
   */
  static async processPaymentFailure(orderId: string, reason = 'Insufficient funds'): Promise<boolean> {
    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) return false;

    order.paymentStatus = 'Failed';
    order.timeline.push({
      status: 'Failed',
      notes: `Payment attempt failed. Reason: ${reason}`,
      updatedAt: new Date(),
    });

    await order.save();
    return true;
  }
}
