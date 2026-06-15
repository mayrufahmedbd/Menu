"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, Package, ShoppingBag, TrendingUp, 
  Plus, CheckCircle, ArrowRight, Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Dashboard states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payout state
  const [payoutAmount, setPayoutAmount] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);

  // New product form states
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [brand, setBrand] = useState("BrandX");
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated || (user?.role !== 'vendor' && user?.role !== 'admin' && user?.role !== 'superadmin')) {
        toast.error("Access denied. Directing to Home.");
        router.push("/");
      } else {
        fetchVendorData();
      }
    }
  }, [mounted, isLoading, isAuthenticated, user]);

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      // Fetch mock or actual vendor data
      setProducts([
        { _id: "p1", title: "Vendor Product A", sku: "VPA-001", price: 99, stock: 12 },
        { _id: "p2", title: "Vendor Product B", sku: "VPB-002", price: 149, stock: 5 },
      ]);
      setOrders([
        { _id: "o1", title: "Order #9923", customer: "Arif Hossein", total: 99, status: "Processing" },
        { _id: "o2", title: "Order #9924", customer: "Suhail Ahmed", total: 149, status: "Delivered" },
      ]);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sku || !price || !stock) {
      toast.error("Please fill in required fields.");
      return;
    }
    setAddingProduct(true);
    try {
      const newProd = {
        _id: `p-${Math.random().toString(36).substring(2, 5)}`,
        title,
        sku,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        stock: parseInt(stock),
        category,
        brand
      };
      setProducts([newProd, ...products]);
      toast.success("Product created successfully!");
      setTitle("");
      setSku("");
      setPrice("");
      setCostPrice("");
      setStock("");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setAddingProduct(false);
    }
  };

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payout amount");
      return;
    }
    setRequestingPayout(true);
    try {
      // Simulate payout request
      toast.success(`Payout request of BDT ${amount} submitted successfully!`);
      setPayoutAmount("");
    } catch (err) {
      toast.error("Payout submission failed");
    } finally {
      setRequestingPayout(false);
    }
  };

  if (!mounted || isLoading || loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground text-sm font-medium">Entering Vendor Portal...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Vendor Earnings Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage inventory, monitor checkout earnings, and request payouts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Earnings</p>
              <h3 className="text-2xl font-bold mt-1">BDT 248.00</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12.4% vs last week
              </p>
            </div>
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Active Products</p>
              <h3 className="text-2xl font-bold mt-1">{products.length} Items</h3>
              <p className="text-xs text-muted-foreground mt-1">Ready for catalog checks</p>
            </div>
            <div className="bg-indigo-500/10 text-indigo-500 p-3 rounded-full">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Processed Orders</p>
              <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
              <p className="text-xs text-muted-foreground mt-1">Awaiting dispatch packing</p>
            </div>
            <div className="bg-green-500/10 text-green-500 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Payout Balance</p>
              <h3 className="text-2xl font-bold mt-1">BDT 150.00</h3>
              <p className="text-xs text-muted-foreground mt-1">Cleared for bank transfer</p>
            </div>
            <div className="bg-amber-500/10 text-amber-500 p-3 rounded-full">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Columns: Products list & Payout Request */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>My Products</CardTitle>
                <CardDescription>Items managed in your catalog.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border text-sm">
                {products.map((prod) => (
                  <div key={prod._id} className="py-3.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-base">{prod.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">SKU: {prod.sku} | Category: {prod.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">BDT {prod.price}</p>
                      <p className={`text-xs ${prod.stock < 10 ? 'text-rose-500 font-bold' : 'text-muted-foreground'}`}>{prod.stock} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle>Order Fulfilment Requests</CardTitle>
              <CardDescription>Orders with products bought from your catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border text-sm">
                {orders.map((ord) => (
                  <div key={ord._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{ord.title}</p>
                      <p className="text-xs text-muted-foreground">Customer: {ord.customer}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold">BDT {ord.total}</p>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded capitalize">{ord.status}</span>
                      </div>
                      <Button size="icon" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar forms */}
        <div className="space-y-6">
          {/* Add Product Form */}
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Add Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Title *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-background border border-border p-2 rounded-md text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">SKU *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-background border border-border p-2 rounded-md text-sm font-mono"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Price (BDT) *</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-background border border-border p-2 rounded-md text-sm"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Stock *</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-background border border-border p-2 rounded-md text-sm"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Cost Price (BDT)</label>
                  <input
                    type="number"
                    className="w-full bg-background border border-border p-2 rounded-md text-sm"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addingProduct}>
                  {addingProduct ? "Creating..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payout Request */}
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayoutRequest} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Payout Amount (BDT)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-background border border-border p-2 rounded-md text-sm"
                    placeholder="e.g. 50"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full" disabled={requestingPayout}>
                  {requestingPayout ? "Submitting..." : "Submit Payout Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
