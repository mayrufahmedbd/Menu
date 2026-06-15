import { ProductGrid } from "@/components/products/ProductGrid";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  "Smartphones": ["mobile", "phone", "cellphone", "mobilephone", "smartphone", "smartphones", "iphone", "galaxy"],
  "Laptops": ["laptop", "computer", "notebook", "pc", "macbook", "laptops", "computers"],
  "Audio": ["audio", "headphone", "earphone", "headphones", "earbuds", "speaker", "sound", "headset"],
  "Monitors": ["monitor", "monitors", "screen", "display", "screens", "displays"],
  "Accessories": ["accessory", "accessories", "keyboard", "mouse", "trackpad", "charger", "cable"],
  "Tablets": ["tablet", "tablets", "ipad", "galaxy tab"],
  "Wearables": ["watch", "smartwatch", "wearable", "wearables", "fitness band"],
  "Gaming": ["gaming", "console", "consoles", "playstation", "xbox", "nintendo", "switch", "game", "games"],
  "Cameras": ["camera", "cameras", "gopro", "video", "photo"],
};

// This is a Server Component. 
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await dbConnect();

  // Handle dynamic query filtering (search, category)
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category as string;
  const search = resolvedSearchParams.search as string;

  const query: any = {};
  
  if (category) {
    // Exact or case-insensitive match for category
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (search) {
    const searchLower = search.toLowerCase().trim();
    
    // Find categories where the search term matches a synonym
    const matchedCategories = Object.entries(CATEGORY_SYNONYMS)
      .filter(([_, synonyms]) => 
        synonyms.some(syn => syn.includes(searchLower) || searchLower.includes(syn))
      )
      .map(([categoryName]) => categoryName);

    const orConditions: any[] = [
      { title: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];

    if (matchedCategories.length > 0) {
      orConditions.push({
        category: { $in: matchedCategories.map(cat => new RegExp(`^${cat}$`, 'i')) }
      });
    }

    query.$or = orConditions;
  }

  // Fetch from MongoDB
  const rawProducts = await Product.find(query).sort({ createdAt: -1 }).lean();
  
  // Serialize Mongoose docs for passing to Client Component
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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {search ? `Search Results for "${search}"` : category ? `${category} Products` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
