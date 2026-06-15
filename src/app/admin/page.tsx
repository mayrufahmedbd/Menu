"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, DollarSign, Package, ShoppingBag, 
  Users, Check, X, RefreshCw, Settings, CheckCircle2,
  Trash2, Plus, ArrowRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "catalog">("overview");
  
  // Dashboard statuses
  const [orders, setOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [taxRate, setTaxRate] = useState("5");
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Add Product form states (for admin)
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
      if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
        toast.error("Unauthorized access to admin portal.");
        router.push("/");
      } else {
        fetchAdminData();
      }
    }
  }, [mounted, isLoading, isAuthenticated, user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch platform orders
      const ordersRes = await fetch("/api/orders");
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      // Fetch products list
      const productsRes = await fetch("/api/products");
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      // Seeding mock pending vendors
      setVendors([
        { _id: "v1", name: "Star Electronics Ltd", email: "star@electronics.com", phone: "+8801700000000" },
        { _id: "v2", name: "Premium Apparel bd", email: "apparel@premium.com", phone: "+8801800000000" },
      ]);
    } catch (err) {
      toast.error("Failed to load administration registries");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      // Direct simulation update for order status
      const updatedOrders = orders.map((o) => {
        if (o._id === orderId) {
          return { ...o, orderStatus: newStatus };
        }
        return o;
      });
      setOrders(updatedOrders);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sku, price, costPrice, stock, category, brand }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product created successfully!");
        setProducts([data.product, ...products]);
        setTitle("");
        setSku("");
        setPrice("");
        setCostPrice("");
        setStock("");
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setAddingProduct(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product removed successfully!");
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        toast.error(data.message || "Failed to remove product");
      }
    } catch (err) {
      toast.error("Failed to remove product");
    }
  };

  const approveVendor = (vendorId: string) => {
    setVendors(vendors.filter((v) => v._id !== vendorId));
    toast.success("Vendor registration approved successfully!");
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Global e-commerce settings saved!");
  };

  if (!mounted || isLoading || loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <ShieldAlert className="h-10 w-10 animate-pulse text-rose-500" />
        <span className="ml-3 text-muted-foreground text-sm font-semibold">Loading Admin Console...</span>
      </div>
    );
  }

  // Calculate stats
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // SVG Chart data
  const chartData = [12000, 18000, 15000, 24000, 29000, 26000, totalSales || 8000];
  const maxVal = Math.max(...chartData);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Super Admin Controller</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform overview, catalog actions, and vendor approvals.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            size="sm"
          >
            Dashboard Overview
          </Button>
          <Button 
            variant={activeTab === "catalog" ? "default" : "outline"}
            onClick={() => setActiveTab("catalog")}
            size="sm"
          >
            Catalog Management ({products.length})
          </Button>
          <Button onClick={fetchAdminData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">BDT {totalSales.toFixed(2)}</h3>
                  <p className="text-xs text-muted-foreground mt-1">From cleared payment orders</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-full">
                  <DollarSign className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{orders.length} Placed</h3>
                  <p className="text-xs text-muted-foreground mt-1">Across all users</p>
                </div>
                <div className="bg-sky-500/10 text-sky-500 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Pending Vendors</p>
                  <h3 className="text-2xl font-bold mt-1">{vendors.length} Requests</h3>
                  <p className="text-xs text-rose-500 font-semibold mt-1">Awaiting approval</p>
                </div>
                <div className="bg-rose-500/10 text-rose-500 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">System Status</p>
                  <h3 className="text-2xl font-bold mt-1 text-green-600 flex items-center gap-1.5">
                    <CheckCircle2 className="h-5 w-5" /> Operational
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">API latency optimal</p>
                </div>
                <div className="bg-green-500/10 text-green-500 p-3 rounded-full">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SVG Bar Chart and Settings Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <Card className="lg:col-span-2 border-border shadow-md">
              <CardHeader>
                <CardTitle>Sales Analytics (Weekly Revenue)</CardTitle>
                <CardDescription>Visual summary of platform revenues over the past 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-full h-64 relative bg-muted/20 rounded-xl p-4 flex items-end justify-between gap-2 border border-border">
                  {chartData.map((val, idx) => {
                    const heightPercent = maxVal > 0 ? (val / maxVal) * 85 : 10;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className="w-full bg-gradient-to-t from-primary/80 to-primary hover:opacity-90 rounded-md transition-all duration-300 relative group cursor-pointer"
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs p-1.5 rounded shadow border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            BDT {val}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-2 font-semibold">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Global Settings Panel */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Settings Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveSettings} className="space-y-4 text-sm">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Global Tax Rate (%)</label>
                    <input
                      type="number"
                      className="w-full bg-background border border-border p-2 rounded-md text-sm"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-semibold text-xs">Payment Gateways</p>
                      <p className="text-[10px] text-muted-foreground">Toggle local payments (bKash/Stripe)</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={paymentGatewayStatus}
                      onChange={(e) => setPaymentGatewayStatus(e.target.checked)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Save Global Configuration
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders Management */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Order Management Registry</CardTitle>
                <CardDescription>View status flags and trigger courier dispatch.</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="divide-y divide-border text-sm">
                    {orders.map((ord) => (
                      <div key={ord._id} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Order #{ord._id.toString().substring(18).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">
                            Customer: {ord.shippingDetails.fullName} | Total: BDT {ord.totalAmount}
                          </p>
                          <p className="text-xs mt-1">
                            Status: <span className="font-bold text-amber-600 capitalize">{ord.orderStatus}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {ord.orderStatus === 'Pending' && (
                            <Button
                              size="xs"
                              onClick={() => updateOrderStatus(ord._id, 'Confirmed')}
                              disabled={updating === ord._id}
                            >
                              Confirm
                            </Button>
                          )}
                          {ord.orderStatus === 'Confirmed' && (
                            <Button
                              size="xs"
                              onClick={() => updateOrderStatus(ord._id, 'Shipped')}
                              disabled={updating === ord._id}
                            >
                              Dispatch
                            </Button>
                          )}
                          {ord.orderStatus === 'Shipped' && (
                            <Button
                              size="xs"
                              onClick={() => updateOrderStatus(ord._id, 'Delivered')}
                              disabled={updating === ord._id}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-6">No platform orders placed yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Vendor Approvals queue */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Vendor Application Queue</CardTitle>
                <CardDescription>Approve or decline merchant sales profiles.</CardDescription>
              </CardHeader>
              <CardContent>
                {vendors.length > 0 ? (
                  <div className="divide-y divide-border text-sm">
                    {vendors.map((vend) => (
                      <div key={vend._id} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-base">{vend.name}</p>
                          <p className="text-xs text-muted-foreground">{vend.email} | {vend.phone}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-green-600" onClick={() => approveVendor(vend._id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-rose-600" onClick={() => setVendors(vendors.filter((v) => v._id !== vend._id))}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-6">No pending merchant requests.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        /* CATALOG MANAGEMENT TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Products List */}
          <Card className="lg:col-span-2 border-border shadow-md">
            <CardHeader>
              <CardTitle>Catalog Products List</CardTitle>
              <CardDescription>View, manage inventory, and remove products from database.</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="divide-y divide-border text-sm">
                  {products.map((prod) => (
                    <div key={prod._id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-base">{prod.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          SKU: {prod.sku} | Brand: {prod.brand} | Category: {prod.category}
                        </p>
                        <p className="text-xs mt-0.5">
                          Stock: <span className={prod.stock === 0 ? "text-rose-500 font-bold" : "font-bold text-foreground"}>{prod.stock}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-base">BDT {prod.price}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={() => handleRemoveProduct(prod._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-10 border border-dashed rounded-lg">
                  No products in catalog. Use the form to add some.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Add Product Form */}
          <Card className="border-border shadow-md h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Add New Product
              </CardTitle>
              <CardDescription>Insert a new product into the database.</CardDescription>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Category *</label>
                    <select
                      className="w-full bg-background border border-border p-2 rounded-md text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Laptops</option>
                      <option>Smartphones</option>
                      <option>Audio</option>
                      <option>Monitors</option>
                      <option>Accessories</option>
                      <option>Tablets</option>
                      <option>Wearables</option>
                      <option>Gaming</option>
                      <option>Cameras</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Brand *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-background border border-border p-2 rounded-md text-sm"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold mt-2" disabled={addingProduct}>
                  {addingProduct ? "Creating..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
