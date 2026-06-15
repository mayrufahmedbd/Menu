"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ShoppingBag, Star, Clock, Gift, 
  Smartphone, Mail, CheckCircle2, ChevronLeft, ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  rating: number;
  reviews: any[];
  images: string[];
}
interface Banner {
  _id: string;
  title: string;
  image: string;
  link: string;
  position: string;
}

interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

export function LandingPageContent({ 
  products, 
  banners,
  categories,
  brands,
  reviews,
  dealProduct
}: { 
  products: Product[],
  banners: Banner[],
  categories: Category[],
  brands: Brand[],
  reviews: Review[],
  dealProduct: any
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 44, seconds: 12 });
  const [emailSub, setEmailSub] = useState("");

  const heroBanners = banners.filter(b => b.position === 'hero');
  const slides = heroBanners.length > 0 ? heroBanners.map(b => ({
    title: b.title,
    subtitle: "Check out our latest exclusive offers.",
    link: b.link,
    color: "from-blue-600 to-indigo-900",
    image: b.image
  })) : [
    {
      title: "Discover Premium Gear for your Digital Life",
      subtitle: "Discover laptops, accessories, and mobile devices at the best price.",
      link: "/products",
      color: "from-blue-600 to-indigo-900",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80"
    },
    {
      title: "Uncompromising Audio Fidelity",
      subtitle: "Elevate your music with premium noise cancellation headphones.",
      link: "/products?category=Audio",
      color: "from-purple-600 to-pink-900",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80"
    }
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash Sale countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailSub })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Subscribed successfully!");
        setEmailSub("");
      } else {
        toast.error(data.message || "Subscription failed");
      }
    } catch (err) {
      toast.error("Subscription failed");
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SLIDER */}
      <div className="relative h-[480px] sm:h-[600px] w-full overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={slides[activeSlide].image} 
              alt={slides[activeSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/50 to-transparent z-10" />
            
            <div className="absolute inset-0 flex items-center z-20 container mx-auto px-6 sm:px-12">
              <div className="max-w-xl space-y-6 text-white">
                <span className="inline-flex items-center rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
                  Flash Deal Spotlight
                </span>
                <h1 className="text-3xl sm:text-5xl font-black leading-tight">
                  {slides[activeSlide].title}
                </h1>
                <p className="text-sm sm:text-lg opacity-85">
                  {slides[activeSlide].subtitle}
                </p>
                <div className="flex gap-4 pt-2">
                  <Link href={slides[activeSlide].link}>
                    <Button size="lg" className="rounded-full group font-bold">
                      Shop Now <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <button 
          onClick={() => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={() => setActiveSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* 2. FLASH SALES & DEAL OF THE DAY */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Flash Sales Segment */}
          <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-muted/20 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Limited Offer
                </span>
                <h2 className="text-2xl font-extrabold mt-1">Daily Flash Sales</h2>
              </div>
              
              {/* Countdown */}
              <div className="flex items-center gap-2 text-sm font-bold">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Ends in:</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>

            {/* Flash Sale products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map((p) => (
                <div key={p._id} className="bg-background rounded-xl p-4 border border-border flex gap-4 hover:shadow-md transition-shadow">
                  <div className="h-24 w-24 shrink-0 bg-muted rounded-lg overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{p.brand}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-sm text-primary">BDT {p.price}</span>
                        <span className="text-[10px] text-muted-foreground block line-through">BDT {p.price + 200}</span>
                      </div>
                      <Button size="xs" onClick={() => handleAddToCart(p)}>Add</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal of the Day */}
          <div className="border border-border rounded-2xl p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
            {dealProduct ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Deal of the Day
                    </span>
                    <Gift className="h-5 w-5 text-amber-500 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold">{dealProduct.title}</h3>
                  <p className="text-xs opacity-75 mt-1">Special limited time offer.</p>
                  
                  <div className="mt-6">
                    <span className="text-3xl font-black">BDT {dealProduct.discountPrice}</span>
                    <span className="text-xs opacity-60 line-through block">BDT {dealProduct.price}</span>
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <Link href={`/products/${dealProduct.slug}`} className="block mt-4">
                    <Button variant="secondary" className="w-full font-bold">
                      Claim Deal &rarr;
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">No active deals right now.</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. PROMOTIONAL BANNERS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.filter(b => b.position === 'promo').slice(0, 3).map((b) => (
            <div key={b._id} className="h-48 rounded-2xl overflow-hidden relative group cursor-pointer bg-slate-950">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent z-10" />
              <img src={b.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt={b.title} />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between text-white">
                <div>
                  <h4 className="font-bold text-lg">{b.title}</h4>
                </div>
                <Link href={b.link}>
                  <span className="text-xs font-bold underline flex items-center gap-1">Shop Now <ArrowRight className="h-3 w-3" /></span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR CATEGORIES */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Popular Categories</h2>
          <p className="text-muted-foreground text-sm">Explore categories in our ecosystem.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
          {(categories.length > 0 ? categories : [
            { name: "Laptops", icon: "💻" },
            { name: "Smartphones", icon: "📱" },
            { name: "Audio", icon: "🎧" },
            { name: "Monitors", icon: "🖥️" },
            { name: "Wearables", icon: "⌚" },
            { name: "Gaming", icon: "🎮" },
          ]).map((cat: any, i) => (
            <Link key={i} href={`/products?category=${cat.name}`}>
              <Card className="hover:border-primary/50 transition-colors text-center p-6 cursor-pointer h-full">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TOP BRANDS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 border-y border-border py-8">
        <div className="flex flex-wrap items-center justify-around gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
          {(brands.length > 0 ? brands.map(b => b.name) : ["Apple", "Samsung", "Sony", "LG", "Logitech", "Nintendo"]).map((brand, i) => (
            <span key={i} className="font-black text-xl sm:text-2xl tracking-wider select-none">
              {brand.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS / CUSTOMER REVIEWS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Loved by Customers</h2>
          <p className="text-muted-foreground text-sm">Real reviews from our platform checkouts.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(reviews.length > 0 ? reviews : [
            { name: "Zahid Hasan", role: "Developer", review: "The customer service was exceptional. Ordered a MacBook and got it within 24 hours in Dhaka!", rating: 5 },
            { name: "Mridula Rahman", role: "Designer", review: "Stunning display quality on the Dell XPS. Delivery agent from SteadFast was extremely polite.", rating: 5 },
            { name: "Rashed Karim", role: "Gamer", review: "The LG gaming monitor is a beast! Setup was easy and SSLCommerz payment went through instantly.", rating: 4 },
          ]).map((rev: any, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, rIdx) => (
                    <Star key={rIdx} className={`h-4 w-4 ${rIdx < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">&ldquo;{rev.review}&rdquo;</p>
                <div>
                  <h4 className="font-bold text-sm">{rev.name}</h4>
                  <span className="text-[10px] text-muted-foreground">{rev.role}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER SUBSCRIPTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Subscribe to our Newsletters</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Receive updates on campaigns, discount coupons, and hot deals directly to your email.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              required
              className="bg-background rounded-full" 
              value={emailSub}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSub(e.target.value)}
            />
            <Button type="submit" className="rounded-full px-6 shrink-0 font-bold">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* 8. MOBILE APP PROMOTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto overflow-hidden relative">
          <div className="space-y-6 max-w-md">
            <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
              Mobile App coming soon
            </span>
            <h2 className="text-3xl font-extrabold leading-tight">Shop on the Go with ecom-app Mobile</h2>
            <p className="text-sm opacity-80">
              Download our progressive web app (PWA) to track orders, receive push notifications, and access one-click payment flows.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> PWA Install
              </Button>
            </div>
          </div>
          
          {/* Mockup SVG Phone */}
          <div className="w-64 h-80 relative shrink-0 opacity-80 md:opacity-100">
            <div className="absolute bottom-[-100px] right-0 w-56 h-96 bg-slate-800 border-4 border-slate-700 rounded-3xl shadow-2xl p-4 flex flex-col justify-between">
              <div className="w-16 h-4 bg-slate-700 rounded-full mx-auto" />
              <div className="flex-1 bg-slate-900 rounded-xl mt-4 p-3 flex flex-col justify-around text-center">
                <span className="text-xs text-primary font-black uppercase">ecom-app</span>
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                <span className="text-[10px] opacity-75">Fast checkout configured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
