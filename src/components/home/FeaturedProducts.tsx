"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

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

export function FeaturedProducts({ products }: { products: Product[] }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id || product.slug,
      title: product.title,
      price: product.discountPrice || product.price,
      image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked gear for the modern setup.</p>
          </div>
          <Button variant="link" className="hidden md:inline-flex mt-4 md:mt-0 text-primary">
            View all products &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product._id || product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden group h-full flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.discountPrice && (
                    <Badge className="absolute top-3 left-3 z-10" variant="destructive">
                      Sale
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <img
                    src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"}
                    alt={product.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5 flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews?.length || 0})</span>
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
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
                <CardFooter className="p-5 pt-0 mt-auto">
                  <Button 
                    className="w-full rounded-full gap-2 transition-all cursor-pointer"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
