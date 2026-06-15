"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  images: string[];
}

export function AddToCartButton({ product, size = "default" }: { product: Product, size?: "default" | "lg" | "sm" }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      brand: product.brand,
      category: product.category,
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <Button 
      size={size}
      className="rounded-full gap-2 transition-all cursor-pointer w-full sm:w-auto"
      onClick={handleAddToCart}
    >
      <ShoppingCart className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} /> Add to Cart
    </Button>
  );
}
