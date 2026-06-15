"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-card border border-border shadow-2xl rounded-2xl p-8 sm:p-12 text-center"
    >
      <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold mb-4">Order Successful!</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Thank you for your purchase. We've received your order and are getting it ready for shipment.
      </p>

      {orderId && (
        <div className="bg-muted rounded-xl p-4 mb-8 text-left flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Order ID:</span>
          <span className="font-mono font-bold text-primary">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products" className="w-full sm:w-auto">
          <Button size="lg" className="w-full rounded-full gap-2">
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <Suspense fallback={
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
