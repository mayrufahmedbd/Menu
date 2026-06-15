import { ProductGrid } from "@/components/products/ProductGrid";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { BadgePercent } from "lucide-react";

export default async function DealsPage() {
  await dbConnect();

  // Fetch products that have a discountPrice
  const rawProducts = await Product.find({ 
    discountPrice: { $exists: true, $ne: null } 
  }).sort({ createdAt: -1 }).lean();
  
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
      <div className="flex flex-col mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center sm:justify-start gap-3 text-destructive">
          <BadgePercent className="h-10 w-10" /> Hot Deals
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Don't miss out on these limited-time offers. Grab your favorite tech gear at unbeatable prices before they're gone!
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
