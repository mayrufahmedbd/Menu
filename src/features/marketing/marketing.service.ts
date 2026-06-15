import Coupon from '@/models/Coupon';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import connectToDatabase from '@/lib/db';

export class MarketingService {
  /**
   * Validates a coupon code and returns the discount amount.
   */
  static async validateCoupon(
    code: string,
    cartTotal: number
  ): Promise<{ isValid: boolean; discountAmount: number; message: string }> {
    await connectToDatabase();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return { isValid: false, discountAmount: 0, message: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountAmount: 0, message: 'Coupon is inactive' };
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return { isValid: false, discountAmount: 0, message: 'Coupon has expired' };
    }

    if (cartTotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Minimum order amount of BDT ${coupon.minOrderAmount} required`,
      };
    }

    if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
      return { isValid: false, discountAmount: 0, message: 'Coupon usage limit reached' };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Cap discount to cartTotal
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return {
      isValid: true,
      discountAmount: Math.round(discountAmount),
      message: 'Coupon applied successfully',
    };
  }

  /**
   * Tracks and rewards a referral link registration.
   */
  static async processReferral(newUserId: string, referralCode: string): Promise<boolean> {
    await connectToDatabase();

    const referrer = await User.findOne({ referralCode });
    if (!referrer) return false;

    const newUser = await User.findById(newUserId);
    if (!newUser || newUser.referredBy) return false; // Already referred or doesn't exist

    newUser.referredBy = referrer._id as any;
    await newUser.save();

    // Reward referrer with 50 loyalty points
    referrer.rewardPoints += 50;
    await referrer.save();

    // Log transaction in referrer's wallet
    const wallet = await Wallet.findOne({ user: referrer._id });
    if (wallet) {
      wallet.transactions.push({
        amount: 50,
        type: 'rewards_credit',
        description: `Earned 50 points for inviting ${newUser.name}`,
        createdAt: new Date(),
      });
      await wallet.save();
    }

    return true;
  }
}
