import { notFound } from "next/navigation";
import Image from "next/image";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/products/AddToCartButton";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  
  const { slug } = await params;
  const rawProduct = await Product.findOne({ slug }).lean();

  if (!rawProduct) {
    notFound();
  }

  // Serialize Mongoose doc
  const product = {
    _id: rawProduct._id.toString(),
    title: rawProduct.title,
    slug: rawProduct.slug,
    description: rawProduct.description,
    price: rawProduct.price,
    discountPrice: rawProduct.discountPrice,
    category: rawProduct.category,
    brand: rawProduct.brand,
    stock: rawProduct.stock,
    rating: rawProduct.rating || 4.5,
    reviews: rawProduct.reviews || [],
    images: rawProduct.images,
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted border border-border">
            {product.discountPrice && (
              <Badge className="absolute top-4 left-4 z-10 text-sm px-3 py-1" variant="destructive">
                Sale
              </Badge>
            )}
            <img
              src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Thumbnails (mocked structure) */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted border border-border cursor-pointer hover:border-primary transition-colors">
                 <img
                  src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                  alt={`${product.title} view ${i}`}
                  className="object-cover w-full h-full opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{product.brand}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-muted-foreground">{product.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground underline cursor-pointer">{product.reviews.length} reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            {product.discountPrice ? (
              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold">৳{product.discountPrice.toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through mb-1">৳{product.price.toFixed(2)}</span>
                <span className="bg-destructive/10 text-destructive text-sm font-bold px-2 py-1 rounded-md mb-2">
                  Save ৳{(product.price - product.discountPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold">৳{product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-base text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">1 Year Warranty</p>
                <p className="text-xs text-muted-foreground">Official Brand Warranty included</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Free shipping on orders over ৳5000</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({product.stock})</span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>
            <AddToCartButton product={product} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
