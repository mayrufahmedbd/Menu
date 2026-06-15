import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    const body = await req.json();
    
    const { 
      items, 
      shippingDetails, 
      paymentMethod, 
      totalAmount,
      shippingCost = 0,
      discountAmount = 0,
      couponApplied = '',
      shippingProvider = 'steadsfast'
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      user: session?.userId || undefined,
      trackingNumber,
      items,
      shippingDetails,
      paymentMethod,
      totalAmount,
      shippingCost,
      discountAmount,
      couponApplied,
      shippingProvider,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      timeline: [{
        status: 'Pending',
        notes: 'Order submitted. Awaiting payment authorization.',
        updatedAt: new Date()
      }]
    });

    await order.save();

    // Redirection URL for Payment Gateways
    if (paymentMethod !== 'COD') {
      return NextResponse.json({ 
        success: true, 
        message: "Order placed. Redirecting to gateway...", 
        orderId: order._id,
        gatewayUrl: `/mock-payment?orderId=${order._id}&amount=${totalAmount}`
      });
    }

    // Cash on Delivery
    return NextResponse.json({ 
      success: true, 
      message: "Order placed successfully!", 
      orderId: order._id 
    });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
