"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReturnsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen space-y-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Returns & Exchanges Policy</h1>
        <p className="text-muted-foreground">Easy returns and swift exchange timelines for all purchases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-md text-center p-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <RotateCcw className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm">7-Day Free Returns</h3>
          <p className="text-xs text-muted-foreground mt-2">Return items within 7 days of package delivery for a full refund.</p>
        </Card>

        <Card className="border-border shadow-md text-center p-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm">Instant Exchanges</h3>
          <p className="text-xs text-muted-foreground mt-2">Swap sizes or select alternative variations on-demand.</p>
        </Card>

        <Card className="border-border shadow-md text-center p-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm">Wallet Credits</h3>
          <p className="text-xs text-muted-foreground mt-2">Opt to receive refunds directly to your platform wallet balance.</p>
        </Card>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>How to Return or Exchange an Item</CardTitle>
          <CardDescription>Follow these 3 easy steps to process your request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Submit a Refund Request</strong>: Log in and go to your <strong>Wallet & Orders dashboard</strong> inside your Profile panel, and click "Submit Support Ticket" or "Refund" next to the order.
            </li>
            <li>
              <strong>Courier Pick-up</strong>: Our shipping partners (Pathao/SteadFast) will contact you to pick up the package from your address.
            </li>
            <li>
              <strong>Quality Check & Refund</strong>: Once the warehouse verifies the package conditions, your refund will be deposited into your <strong>Wallet Balance</strong> or original payment card within 3-5 working days.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
