import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET all products
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST to create a product (requires admin, superadmin, or vendor)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'superadmin', 'vendor'].includes(session.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { title, price, costPrice, stock, category, brand, sku } = body;

    if (!title || !price || !stock || !category || !brand || !sku) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = new Product({
      title,
      slug,
      sku,
      price: parseFloat(price),
      regularPrice: parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      stock: parseInt(stock),
      category,
      brand,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
      status: 'active',
      isFeatured: false,
      productType: 'physical',
      vendor: new mongoose.Types.ObjectId(session.userId),
    });

    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: 'Product added successfully!',
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Duplicate SKU or slug detected.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE to remove a product (requires admin, superadmin, or the vendor who owns it)
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'superadmin', 'vendor'].includes(session.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ message: 'Missing product ID' }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Role checks: superadmin/admin can delete anything. Vendor can only delete their own.
    if (session.role === 'vendor' && product.vendor?.toString() !== session.userId) {
      return NextResponse.json({ message: 'Unauthorized to delete this product' }, { status: 403 });
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: 'Product removed successfully!',
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
