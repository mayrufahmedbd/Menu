"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Truck, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShippingPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen space-y-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Shipping Information</h1>
        <p className="text-muted-foreground">Fast, secure courier delivery mappings across all districts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Logistics Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span><strong>Pathao Delivery</strong></span>
              <span className="text-muted-foreground">1-2 Days (Dhaka)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span><strong>SteadFast Courier</strong></span>
              <span className="text-muted-foreground">2-3 Days (Standard)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span><strong>RedX Logistics</strong></span>
              <span className="text-muted-foreground">2-4 Days (Standard)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span><strong>Paperfly Private</strong></span>
              <span className="text-muted-foreground">3-5 Days (Remote)</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Sundarban Courier</strong></span>
              <span className="text-muted-foreground">2-3 Days (Counter-to-counter)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Delivery Charges
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-3 leading-relaxed">
            <p>
              <strong>Inside Dhaka</strong>: Base rate of BDT 50 - 65 depending on the courier provider. Delivery typically occurs within 24 to 48 hours.
            </p>
            <p>
              <strong>Outside Dhaka</strong>: A flat delivery surcharge of BDT 40 is added to the courier's base rate. Packages are delivered in 2-5 working days.
            </p>
            <div className="p-3 bg-primary/5 rounded border text-[11px] text-muted-foreground mt-2">
              Note: Digital products and bundles containing downloadable items incur zero shipping costs and are delivered instantly to your Profile tab.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div>
            <h4 className="font-bold text-foreground">How do I track my package?</h4>
            <p className="text-muted-foreground text-xs mt-1">
              Once payment is processed, a tracking number from the selected courier is generated. You can track this in real-time in the "Orders History" tab of your Customer Profile page.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-foreground">What if my package is delayed?</h4>
            <p className="text-muted-foreground text-xs mt-1">
              You can log a support request ticket directly from the dashboard under the "Customer Support" tab, or call our hotlines for immediate assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
