import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let tickets;

    if (session.role === 'admin' || session.role === 'superadmin') {
      tickets = await SupportTicket.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    } else {
      tickets = await SupportTicket.find({ user: new mongoose.Types.ObjectId(session.userId) }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, category, priority, message } = body;

    if (!subject || !category || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const ticket = new SupportTicket({
      user: new mongoose.Types.ObjectId(session.userId),
      subject,
      category,
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          sender: new mongoose.Types.ObjectId(session.userId),
          message
        }
      ]
    });

    await ticket.save();

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
