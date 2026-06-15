import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  link: string;
  position: 'hero' | 'promo' | 'sidebar';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    position: { type: String, enum: ['hero', 'promo', 'sidebar'], default: 'promo' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banners: Model<IBanner> = mongoose.models.Banners || mongoose.model<IBanner>('Banners', bannerSchema);

export default Banners;
