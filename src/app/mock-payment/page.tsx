"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (status: 'Paid' | 'Failed') => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/mock-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        if (status === 'Paid') {
          toast.success("Payment successful!");
          router.push(`/checkout/success?orderId=${orderId}`);
        } else {
          toast.error("Payment failed or cancelled.");
          router.push(`/cart`);
        }
      } else {
        toast.error("Error communicating with mock gateway.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Network error");
      setIsProcessing(false);
    }
  };

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Invalid Payment Session</h2>
        <Button className="mt-4" onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border-primary/20 shadow-2xl">
      <CardHeader className="text-center pb-8 border-b">
        <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Mock SSLCommerz Gateway</CardTitle>
        <CardDescription>This is a testing sandbox. No real money will be charged.</CardDescription>
      </CardHeader>
      
      <CardContent className="py-8 text-center space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
          <p className="text-5xl font-bold">৳{amount}</p>
        </div>
        
        <div className="bg-muted p-4 rounded-lg flex items-center justify-center gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <span className="font-mono text-sm">Order ID: {orderId}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full text-lg h-12 bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={() => handlePayment('Paid')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          Simulate Successful Payment
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handlePayment('Failed')}
          disabled={isProcessing}
        >
          Cancel Payment
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MockPaymentPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Suspense fallback={<div className="animate-pulse h-96 w-full max-w-md bg-card rounded-xl"></div>}>
        <MockPaymentContent />
      </Suspense>
    </div>
  );
}
