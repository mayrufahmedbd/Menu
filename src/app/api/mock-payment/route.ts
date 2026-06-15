import { NextResponse } from "next/server";
import { PaymentService } from "@/features/payments/payment.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ message: "Missing orderId or status" }, { status: 400 });
    }

    const txnId = `MOCK-TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    if (status === 'Paid') {
      const success = await PaymentService.processPaymentSuccess(orderId, txnId);
      if (!success) {
        return NextResponse.json({ message: "Failed to process payment success" }, { status: 400 });
      }
    } else {
      const success = await PaymentService.processPaymentFailure(orderId, "User cancelled simulated payment flow");
      if (!success) {
        return NextResponse.json({ message: "Failed to process payment cancellation" }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order payment status updated to ${status}` 
    });

  } catch (error: any) {
    console.error("Mock Payment Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
