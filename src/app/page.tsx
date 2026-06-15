import { LandingPageContent } from "@/components/home/LandingPageContent";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Banners from "@/models/Banners";
import { Category, Brand } from "@/models/Category";
import Review from "@/models/Review";

export default async function Home() {
  await dbConnect();

  // Fetch products to feed landing elements
  const rawProducts = await Product.find({ status: 'active' }).limit(6).lean();

  const products = rawProducts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    price: p.price,
    discountPrice: p.discountPrice,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviews: p.reviews || [],
    images: p.images || [],
  }));

  // Fetch dynamic sections
  const rawBanners = await Banners.find({ isActive: true }).lean();
  const banners = rawBanners.map((b: any) => ({
    _id: b._id.toString(),
    title: b.title,
    image: b.image,
    link: b.link,
    position: b.position
  }));

  const rawCategories = await Category.find().limit(6).lean();
  const categories = rawCategories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    icon: c.icon || "📦"
  }));

  const rawBrands = await Brand.find().limit(6).lean();
  const brands = rawBrands.map((b: any) => ({
    _id: b._id.toString(),
    name: b.name
  }));

  const rawReviews = await Review.find({ status: 'approved' }).sort({ rating: -1 }).limit(3).populate('user', 'name').lean();
  const reviews = rawReviews.map((r: any) => ({
    _id: r._id.toString(),
    name: r.user?.name || "Customer",
    role: "Verified Buyer",
    review: r.comment,
    rating: r.rating
  }));

  const dealProductRaw = await Product.findOne({ discountPrice: { $gt: 0 }, status: 'active' }).lean();
  let dealProduct = null;
  if (dealProductRaw) {
    dealProduct = {
      _id: dealProductRaw._id.toString(),
      title: dealProductRaw.title,
      slug: dealProductRaw.slug,
      price: dealProductRaw.price,
      discountPrice: dealProductRaw.discountPrice,
      images: dealProductRaw.images || []
    };
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageContent 
        products={products} 
        banners={banners}
        categories={categories}
        brands={brands}
        reviews={reviews}
        dealProduct={dealProduct}
      />
    </div>
  );
}
