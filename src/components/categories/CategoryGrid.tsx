"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Laptop, Smartphone, Headphones, Mouse, Monitor, Tablet, Watch, Gamepad2, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  { id: "laptops", title: "Laptops", icon: Laptop, color: "bg-blue-500/10 text-blue-500" },
  { id: "smartphones", title: "Smartphones", icon: Smartphone, color: "bg-purple-500/10 text-purple-500" },
  { id: "audio", title: "Audio", icon: Headphones, color: "bg-green-500/10 text-green-500" },
  { id: "accessories", title: "Accessories", icon: Mouse, color: "bg-orange-500/10 text-orange-500" },
  { id: "monitors", title: "Monitors", icon: Monitor, color: "bg-cyan-500/10 text-cyan-500" },
  { id: "tablets", title: "Tablets", icon: Tablet, color: "bg-rose-500/10 text-rose-500" },
  { id: "wearables", title: "Wearables", icon: Watch, color: "bg-yellow-500/10 text-yellow-500" },
  { id: "gaming", title: "Gaming", icon: Gamepad2, color: "bg-indigo-500/10 text-indigo-500" },
  { id: "cameras", title: "Cameras", icon: Camera, color: "bg-pink-500/10 text-pink-500" },
];

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {CATEGORIES.map((category, index) => {
        const Icon = category.icon;
        const count = counts[category.title.toLowerCase()] || 0;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/products?category=${encodeURIComponent(category.title)}`}>
              <Card className="h-full border-border hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className={`p-4 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {count} Products
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
