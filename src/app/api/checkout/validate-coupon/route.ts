import { NextResponse } from 'next/server';
import { MarketingService } from '@/features/marketing/marketing.service';

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    const validationResult = await MarketingService.validateCoupon(code, cartTotal || 0);

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
