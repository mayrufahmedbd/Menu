"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User, MapPin, Truck, CreditCard, CheckSquare, 
  ArrowLeft, ArrowRight, ShieldCheck, Tag 
} from "lucide-react";

// Form validation schemas
const checkoutSchema = z.object({
  // Step 1: Customer Info
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  // Step 2: Address Info
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const COURIER_OPTIONS = [
  { id: 'pathao', name: 'Pathao Delivery', base: 60, days: '1-2 Days' },
  { id: 'steadfast', name: 'SteadFast Courier', base: 55, days: '2-3 Days' },
  { id: 'redx', name: 'RedX Logistics', base: 65, days: '2-4 Days' },
  { id: 'paperfly', name: 'Paperfly Private', base: 50, days: '3-5 Days' },
  { id: 'sundarban', name: 'Sundarban Courier', base: 100, days: '2-3 Days' },
];

const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery', desc: 'Pay with cash upon package receipt' },
  { id: 'STRIPE', name: 'Credit / Debit Card (Stripe)', desc: 'Pay instantly with Visa, Mastercard, or Amex' },
  { id: 'BKASH', name: 'bKash Mobile Wallet', desc: 'Instant mobile transfer' },
  { id: 'NAGAD', name: 'Nagad Wallet', desc: 'Secure local mobile checkouts' },
  { id: 'PAYPAL', name: 'PayPal checkout', desc: 'Pay using your international PayPal account' },
  { id: 'SSLCOMMERZ', name: 'SSLCommerz Local Gateway', desc: 'Pay via cards or local banking networks' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState('steadfast');
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.addresses?.[0]?.street || "",
      city: user?.addresses?.[0]?.city || "Dhaka",
      postalCode: user?.addresses?.[0]?.postalCode || "",
      country: user?.addresses?.[0]?.country || "Bangladesh",
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your shopping cart is empty</h2>
        <Button onClick={() => router.push('/products')}>Browse products</Button>
      </div>
    );
  }

  // Calculate costs
  const subtotal = getCartTotal();
  
  // Calculate shipping cost based on courier base rate & destination surcharge
  const courier = COURIER_OPTIONS.find(c => c.id === selectedCourier) || COURIER_OPTIONS[1];
  const isOutsideDhaka = getValues("city")?.toLowerCase() !== 'dhaka';
  const shippingCost = courier.base + (isOutsideDhaka ? 40 : 0);
  
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  // Handle step progression with validation checks
  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["fullName", "email", "phone"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["address", "city", "postalCode", "country"]);
    } else {
      isValid = true; // steps 3 and 4 don't use hook-form inputs directly
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please fill in required fields correctly before moving forward.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCheckingCoupon(true);
    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.isValid) {
        setDiscountAmount(data.discountAmount);
        setAppliedCoupon(couponCode.toUpperCase());
        toast.success(data.message);
      } else {
        toast.error(data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error("Error validating coupon code");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const checkoutFormDetails = getValues();
      const orderData = {
        shippingDetails: {
          fullName: checkoutFormDetails.fullName,
          email: checkoutFormDetails.email,
          phone: checkoutFormDetails.phone,
          address: checkoutFormDetails.address,
          city: checkoutFormDetails.city,
          postalCode: checkoutFormDetails.postalCode,
        },
        items: items.map(i => ({ 
          product: i.id, 
          title: i.title, 
          quantity: i.quantity, 
          price: i.price,
          vendor: i.vendor || undefined
        })),
        paymentMethod: selectedPayment,
        shippingProvider: selectedCourier,
        shippingCost,
        discountAmount,
        couponApplied: appliedCoupon,
        totalAmount: total,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Order placed successfully!");
        clearCart();
        if (result.gatewayUrl) {
          router.push(result.gatewayUrl);
        } else {
          router.push(`/checkout/success?orderId=${result.orderId}`);
        }
      } else {
        toast.error(result.message || "Failed to place order.");
      }
    } catch (error) {
      toast.error("Checkout processing error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center max-w-2xl mx-auto mb-10 text-xs sm:text-sm">
        {[
          { step: 1, label: "Info", icon: User },
          { step: 2, label: "Address", icon: MapPin },
          { step: 3, label: "Courier", icon: Truck },
          { step: 4, label: "Payment", icon: CreditCard },
          { step: 5, label: "Confirm", icon: CheckSquare },
        ].map((item) => (
          <div key={item.step} className="flex flex-col items-center gap-1.5">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border ${
              currentStep === item.step 
                ? "bg-primary text-white border-primary" 
                : currentStep > item.step 
                  ? "bg-primary/20 text-primary border-primary" 
                  : "bg-muted text-muted-foreground border-border"
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className={`font-semibold ${currentStep === item.step ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Step Panels */}
        <div className="flex-1 space-y-6">
          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1: Customer Information */}
            {currentStep === 1 && (
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Step 1 of 5: Supply core contact credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Full Name *</label>
                    <Input {...register("fullName")} className={errors.fullName ? "border-rose-500" : ""} />
                    {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Email Address *</label>
                    <Input type="email" {...register("email")} className={errors.email ? "border-rose-500" : ""} />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Phone Number *</label>
                    <Input {...register("phone")} placeholder="e.g. 01712345678" className={errors.phone ? "border-rose-500" : ""} />
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Address Coordinates */}
            {currentStep === 2 && (
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Shipping Coordinates</CardTitle>
                  <CardDescription>Step 2 of 5: Input parcel dispatch coordinates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Street Address *</label>
                    <Input {...register("address")} placeholder="House #, Street name" className={errors.address ? "border-rose-500" : ""} />
                    {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">City *</label>
                      <Input {...register("city")} className={errors.city ? "border-rose-500" : ""} />
                      {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Postal Code *</label>
                      <Input {...register("postalCode")} className={errors.postalCode ? "border-rose-500" : ""} />
                      {errors.postalCode && <p className="text-xs text-rose-500 mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Country *</label>
                    <Input {...register("country")} className={errors.country ? "border-rose-500" : ""} />
                    {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country.message}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: Courier Services */}
            {currentStep === 3 && (
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                  <CardDescription>Step 3 of 5: Choose dynamic carrier dispatching.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {COURIER_OPTIONS.map((c) => {
                    const price = c.base + (isOutsideDhaka ? 40 : 0);
                    return (
                      <div 
                        key={c.id} 
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedCourier === c.id 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedCourier(c.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-sm">{c.name}</h4>
                            <p className="text-xs text-muted-foreground">Estimated: {c.days}</p>
                          </div>
                          <span className="font-bold text-sm text-primary">BDT {price}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* STEP 4: Payment Gateways */}
            {currentStep === 4 && (
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Step 4 of 5: Select payment gateway.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <div 
                      key={pm.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedPayment === pm.id 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPayment(pm.id)}
                    >
                      <h4 className="font-bold text-sm">{pm.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{pm.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* STEP 5: Order Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <Card className="border-border shadow-md">
                  <CardHeader>
                    <CardTitle>Order Summary Confirmation</CardTitle>
                    <CardDescription>Step 5 of 5: Review all parameters before final placement.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border pb-4">
                      <div>
                        <p className="font-bold text-xs text-muted-foreground uppercase">Recipient Details</p>
                        <p className="font-semibold">{getValues("fullName")}</p>
                        <p className="text-xs text-muted-foreground">{getValues("email")} | {getValues("phone")}</p>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-muted-foreground uppercase">Shipping Address</p>
                        <p className="font-semibold">{getValues("address")}</p>
                        <p className="text-xs text-muted-foreground">{getValues("city")}, {getValues("postalCode")}, {getValues("country")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-xs text-muted-foreground uppercase">Courier Method</p>
                        <p className="font-semibold">{(COURIER_OPTIONS.find(c => c.id === selectedCourier))?.name}</p>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-muted-foreground uppercase">Payment Gateway</p>
                        <p className="font-semibold">{(PAYMENT_METHODS.find(p => p.id === selectedPayment))?.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Promo Code Coupon input */}
                <Card className="border-border shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-primary" /> Apply Promotional Coupon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Input 
                      placeholder="e.g. SAVE20, TECH50" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)} 
                    />
                    <Button onClick={handleApplyCoupon} disabled={checkingCoupon} variant="outline">
                      {checkingCoupon ? "Verifying..." : "Apply"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </form>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6">
            {currentStep > 1 ? (
              <Button onClick={handlePrevStep} variant="ghost" className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : <div />}

            {currentStep < 5 ? (
              <Button onClick={handleNextStep} className="flex items-center gap-1.5">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handlePlaceOrder} 
                className="w-48 bg-primary hover:bg-primary/95 text-white font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
              </Button>
            )}
          </div>
        </div>

        {/* Pricing Sidebar details */}
        <div className="w-full lg:w-96 shrink-0">
          <Card className="sticky top-24 bg-card shadow-lg border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-border pb-3">Review Items</h3>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 pr-4">{item.quantity}x {item.title}</span>
                    <span className="font-semibold whitespace-nowrap">BDT {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">BDT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Charge</span>
                  <span className="font-semibold">BDT {shippingCost.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Coupon ({appliedCoupon})</span>
                    <span>- BDT {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-base">Total Due</span>
                  <span className="font-bold text-2xl text-primary">BDT {total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-muted/40 rounded-lg p-3 text-[11px] text-muted-foreground flex gap-2 border">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>SSL Encrypted and 2FA verified order processing channels. Your transactions details are secure.</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
