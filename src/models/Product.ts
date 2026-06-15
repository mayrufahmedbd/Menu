import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  profitMargin?: number;
  category: string;
  subcategory?: string;
  brand: string;
  tags?: string[];
  stock: number;
  minOrderQuantity: number;
  images: string[];
  videos?: string[];
  specifications?: Record<string, string>;
  warranty?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  colorVariations?: string[];
  sizeVariations?: string[];
  status: 'draft' | 'active' | 'out-of-stock';
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  productType: 'physical' | 'digital' | 'downloadable' | 'bundle';
  downloadUrl?: string;
  bundleItems?: mongoose.Types.ObjectId[];
  vendor?: mongoose.Types.ObjectId;
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number },
    costPrice: { type: Number },
    profitMargin: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    brand: { type: String, required: true },
    tags: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    minOrderQuantity: { type: Number, required: true, default: 1 },
    images: [{ type: String }],
    videos: [{ type: String }],
    specifications: { type: Map, of: String },
    warranty: { type: String },
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    colorVariations: [{ type: String }],
    sizeVariations: [{ type: String }],
    status: { type: String, enum: ['draft', 'active', 'out-of-stock'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    productType: { type: String, enum: ['physical', 'digital', 'downloadable', 'bundle'], default: 'physical' },
    downloadUrl: { type: String },
    bundleItems: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    vendor: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
