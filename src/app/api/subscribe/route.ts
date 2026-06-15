import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if already subscribed
    const existingSubscriber = await Subscription.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ message: "You are already subscribed!" }, { status: 400 });
    }

    // Create new subscription
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    return NextResponse.json({ 
      success: true, 
      message: "Successfully subscribed to the newsletter!" 
    });

  } catch (error: any) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
