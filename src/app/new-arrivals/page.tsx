import { ProductGrid } from "@/components/products/ProductGrid";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { Sparkles } from "lucide-react";

export default async function NewArrivalsPage() {
  await dbConnect();

  // Fetch the latest 8 products based on createdAt
  const rawProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  
  // Serialize Mongoose docs
  const products = rawProducts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    price: p.price,
    discountPrice: p.discountPrice,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviews: p.reviews,
    images: p.images,
  }));

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center sm:justify-start gap-3 text-primary">
          <Sparkles className="h-10 w-10 text-yellow-500" /> New Arrivals
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover the latest cutting-edge technology that just dropped. Be the first to get your hands on these brand new releases.
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
