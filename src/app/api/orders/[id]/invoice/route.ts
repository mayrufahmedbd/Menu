import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">BDT ${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">BDT ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${order._id.toString().substring(18).toUpperCase()}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 14px; line-height: 24px; }
          .title { font-size: 32px; font-weight: bold; color: #111; }
          .header-table { width: 100%; margin-bottom: 40px; }
          .info-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
          .info-table td { width: 50%; vertical-align: top; }
          .items-table { width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px; }
          .items-table th { background: #f8f9fa; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd; }
          .totals-table { float: right; width: 300px; margin-bottom: 20px; }
          .totals-table td { padding: 5px 10px; }
          .btn-print { background: #0070f3; color: white; border: none; padding: 10px 20px; font-size: 14px; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
          @media print {
            .btn-print { display: none; }
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 800px; margin: auto; text-align: right;">
          <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
        </div>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <span class="title">ecom-app</span><br>
                Enterprise E-Commerce Platform
              </td>
              <td style="text-align: right;">
                <strong>Invoice #:</strong> ${order._id.toString().substring(18).toUpperCase()}<br>
                <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                <strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})
              </td>
            </tr>
          </table>

          <table class="info-table">
            <tr>
              <td>
                <h3>Seller</h3>
                ecom-app Inc.<br>
                Banani, Dhaka, Bangladesh<br>
                support@ecomapp.com
              </td>
              <td>
                <h3>Customer</h3>
                ${order.shippingDetails.fullName}<br>
                ${order.shippingDetails.address}<br>
                ${order.shippingDetails.city} - ${order.shippingDetails.postalCode}<br>
                Phone: ${order.shippingDetails.phone}
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">BDT ${(order.totalAmount + order.discountAmount - order.shippingCost).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Discount:</td>
              <td style="text-align: right; color: green;">- BDT ${order.discountAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping:</td>
              <td style="text-align: right;">BDT ${order.shippingCost.toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #333;">
              <td>Total Paid:</td>
              <td style="text-align: right; border-top: 2px solid #333;">BDT ${order.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
          <div style="clear: both; margin-top: 50px; text-align: center; color: #888; font-size: 12px;">
            Thank you for shopping with ecom-app!
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Invoice error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
