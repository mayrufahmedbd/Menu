"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviews: any[];
  images: string[];
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    
    addItem({
      id: product._id || product.id || product.slug,
      title: product.title,
      price: product.discountPrice || product.price,
      image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      brand: product.brand,
      category: product.category,
    });
    toast.success(`${product.title} added to cart!`);
  };

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-2xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product._id || product.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={`/products/${product.slug}`}>
            <Card className="overflow-hidden group h-full flex flex-col border border-border shadow-sm hover:shadow-xl transition-all duration-300 bg-card cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.discountPrice && (
                  <Badge className="absolute top-3 left-3 z-10" variant="destructive">
                    Sale
                  </Badge>
                )}
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                  <Heart className="h-4 w-4" />
                </Button>
                {/* Fallback image if empty */}
                <img
                  src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                  alt={product.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating || 4.5}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews?.length || 0})</span>
                </div>
                <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{product.brand} • {product.category}</p>
                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">৳{product.discountPrice.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">৳{product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">৳{product.price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <Button 
                  className="w-full rounded-full gap-2 transition-all cursor-pointer"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
