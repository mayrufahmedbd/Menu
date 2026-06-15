import SupportTicket, { ISupportTicket } from '@/models/SupportTicket';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export class SupportService {
  /**
   * Creates a new support ticket.
   */
  static async createTicket(
    userId: string,
    subject: string,
    category: string,
    priority: 'low' | 'medium' | 'high',
    initialMessage: string
  ): Promise<ISupportTicket> {
    await connectToDatabase();

    const ticket = await SupportTicket.create({
      user: new mongoose.Types.ObjectId(userId),
      subject,
      category,
      priority,
      status: 'open',
      messages: [
        {
          sender: new mongoose.Types.ObjectId(userId),
          message: initialMessage,
          createdAt: new Date(),
        },
      ],
    });

    return ticket;
  }

  /**
   * Appends a reply message to an existing support ticket.
   */
  static async replyToTicket(ticketId: string, senderId: string, message: string): Promise<ISupportTicket | null> {
    await connectToDatabase();

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return null;

    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(senderId),
      message,
      createdAt: new Date(),
    });

    // Automatically transition status based on who replied
    // In a live system, we would inspect the sender's role
    ticket.status = 'in-progress';
    await ticket.save();

    return ticket;
  }

  /**
   * Retrieves support tickets for a given user.
   */
  static async getUserTickets(userId: string): Promise<ISupportTicket[]> {
    await connectToDatabase();
    return SupportTicket.find({ user: new mongoose.Types.ObjectId(userId) }).sort({ updatedAt: -1 }).lean() as any;
  }
}
