import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let orders;

    if (session.role === 'admin' || session.role === 'superadmin') {
      // Admins see all orders
      orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    } else if (session.role === 'vendor') {
      // Vendors only see orders containing their products
      orders = await Order.find({
        'items.vendor': new mongoose.Types.ObjectId(session.userId),
      }).sort({ createdAt: -1 });
    } else {
      // Customers see their own orders
      const userRecord = await User.findById(session.userId);
      if (userRecord && userRecord.email) {
        orders = await Order.find({
          $or: [
            { user: new mongoose.Types.ObjectId(session.userId) },
            { 'shippingDetails.email': userRecord.email }
          ]
        }).sort({ createdAt: -1 });
      } else {
        orders = await Order.find({ user: new mongoose.Types.ObjectId(session.userId) }).sort({ createdAt: -1 });
      }
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
