"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User as UserIcon, Mail, ShieldCheck, MapPin, 
  Wallet, Award, Share2, Clipboard, 
  FileText, History, LifeBuoy, CheckCircle, Clock, Truck 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkAuth, setUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wallet" | "referral" | "support">("profile");
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Support ticket fields
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Sales");
  const [ticketPriority, setTicketPriority] = useState<"low" | "medium" | "high">("medium");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync edit states when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone, avatar: editAvatar }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Profile update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  // Fetch orders and tickets if active tab changes
  useEffect(() => {
    if (isAuthenticated && user) {
      if (activeTab === "orders") {
        fetchOrders();
      } else if (activeTab === "support") {
        fetchTickets();
      }
    }
  }, [activeTab, isAuthenticated, user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load support tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      toast.error("Please fill in all ticket details.");
      return;
    }
    setSubmittingTicket(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          priority: ticketPriority,
          message: ticketMessage
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTickets([data.ticket, ...tickets]);
        setTicketSubject("");
        setTicketMessage("");
        toast.success("Support ticket submitted successfully!");
      } else {
        toast.error("Failed to submit support ticket");
      }
    } catch (err) {
      toast.error("Failed to submit support ticket");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const copyReferralLink = () => {
    const code = user?.referralCode || "ECOM50";
    const link = `${window.location.origin}/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 bg-muted rounded-full mb-4"></div>
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
        <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
        <Button onClick={() => router.push('/login')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-1/4 space-y-2">
          <Card className="border-border shadow-md p-4">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <span className="text-xs bg-primary/20 text-primary px-2.5 py-0.5 rounded-full capitalize mt-1">
                {user.role}
              </span>
            </div>
            
            <nav className="flex flex-col gap-1 mt-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "profile" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <UserIcon className="h-4 w-4" /> Personal Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "orders" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <History className="h-4 w-4" /> Orders History
              </button>
              <button
                onClick={() => setActiveTab("wallet")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "wallet" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Wallet className="h-4 w-4" /> My Wallet
              </button>
              <button
                onClick={() => setActiveTab("referral")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "referral" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Share2 className="h-4 w-4" /> Referrals & Rewards
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "support" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LifeBuoy className="h-4 w-4" /> Customer Support
              </button>
            </nav>
          </Card>
        </div>

        {/* Tab Content Panels */}
        <div className="w-full md:w-3/4">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="border-border shadow-md">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Review and manage account parameters.</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold mb-1 block">Full Name</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-background border border-border p-2 rounded-md text-sm"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold mb-1 block">Phone Number</label>
                          <input
                            type="text"
                            className="w-full bg-background border border-border p-2 rounded-md text-sm"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Profile Avatar Image URL</label>
                        <input
                          type="text"
                          className="w-full bg-background border border-border p-2 rounded-md text-sm font-mono"
                          placeholder="e.g. https://images.unsplash.com/... or any image link"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={savingProfile} size="sm">
                          {savingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setIsEditing(false);
                            setEditName(user.name || "");
                            setEditPhone(user.phone || "");
                            setEditAvatar(user.avatar || "");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
                        <p className="font-semibold text-base">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
                        <p className="font-semibold text-base">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone Number</label>
                        <p className="font-semibold text-base">{user.phone || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Account Role</label>
                        <p className="font-semibold text-base capitalize">{user.role}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Delivery Addresses</CardTitle>
                  <CardDescription>Configured shipping coordinates.</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 bg-muted/20 relative">
                          {addr.isDefault && (
                            <span className="absolute top-2 right-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
                              Default
                            </span>
                          )}
                          <p className="font-semibold text-sm">{addr.street}</p>
                          <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="text-xs text-muted-foreground">{addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground text-sm">No shipping coordinates defined yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>Track dispatch timelines and download invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="text-center py-10 animate-pulse">Retrieving order lists...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-8">
                    {orders.map((ord) => (
                      <div key={ord._id} className="border border-border rounded-xl p-5 bg-muted/10 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono font-bold text-foreground">#{ord._id.substring(18).toUpperCase()}</span></p>
                            {ord.trackingNumber && (
                              <p className="text-xs text-muted-foreground mt-0.5">Tracking Number: <span className="font-mono font-bold text-primary">{ord.trackingNumber}</span></p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">Placed on {new Date(ord.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                              ord.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                              ord.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              ord.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.orderStatus}
                            </span>
                            <Button 
                              size="xs" 
                              variant="outline" 
                              onClick={() => window.open(`/api/orders/${ord._id}/invoice`, "_blank")}
                            >
                              <FileText className="h-3 w-3 mr-1" /> Invoice
                            </Button>
                          </div>
                        </div>

                        {/* Item list */}
                        <div className="space-y-2">
                          {ord.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{item.title} <span className="text-muted-foreground text-xs">x{item.quantity}</span></span>
                              <span className="font-bold">BDT {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Timeline progress bar */}
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs font-semibold mb-3">Live Dispatch Tracker</p>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="font-bold">Payment Verified</p>
                                <p className="text-muted-foreground text-[10px]">Method: {ord.paymentMethod}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'].includes(ord.orderStatus) ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-bold">Order Processed</p>
                                <p className="text-muted-foreground text-[10px]">Vendor packaging items</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {['Shipped', 'Delivered'].includes(ord.orderStatus) ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Truck className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-bold">Dispatched Courier</p>
                                <p className="text-muted-foreground text-[10px]">Courier: {ord.shippingProvider || 'SteadFast'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed rounded-lg text-muted-foreground text-sm">
                    You have not placed any orders yet.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* WALLET TAB */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-border shadow-md bg-gradient-to-br from-primary/90 to-primary text-white">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <Wallet className="h-8 w-8 opacity-80" />
                      <span className="text-xs uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Balance</span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">BDT {user.walletBalance || 0}</p>
                      <p className="text-xs opacity-75 mt-1">Available for checkout payments</p>
                    </div>
                    <Button variant="secondary" className="w-full mt-2" onClick={() => toast.success("Mock payment deposit initiated!")}>
                      + Quick Deposit
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-md bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <Award className="h-8 w-8 opacity-80" />
                      <span className="text-xs uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Loyalty Points</span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{user.rewardPoints || 0} Points</p>
                      <p className="text-xs opacity-75 mt-1">Earned via purchase checkouts</p>
                    </div>
                    <Button variant="secondary" className="w-full mt-2" onClick={() => toast.info("Points redemption features coming soon!")}>
                      Redeem Points
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Logs */}
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Transactions Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border text-sm">
                    <div className="py-3 flex justify-between">
                      <div>
                        <p className="font-semibold">Initial Account Verification Credit</p>
                        <p className="text-xs text-muted-foreground">Promo Code award</p>
                      </div>
                      <span className="text-green-600 font-bold">+ BDT 0.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* REFERRAL TAB */}
          {activeTab === "referral" && (
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle>Referral Campaign</CardTitle>
                <CardDescription>Invite your friends and earn loyalty points!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/40 p-6 rounded-xl border border-border text-center space-y-4">
                  <p className="text-sm font-semibold">Share your unique invite code below:</p>
                  <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
                    <div className="bg-background border border-border px-4 py-2 rounded-lg font-mono font-bold text-lg select-all">
                      {user.referralCode || "ECOM50"}
                    </div>
                    <Button onClick={copyReferralLink} variant="outline" size="icon">
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get 50 Loyalty Points credited to your wallet whenever a new user signs up using your link!
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Your Referral Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-xs text-muted-foreground">Friends Invited</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-xs text-muted-foreground">Points Earned</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUPPORT TAB */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Submit Support Ticket</CardTitle>
                  <CardDescription>Escalate your query to our customer care team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Subject</label>
                        <input
                          type="text"
                          className="w-full bg-background border border-border p-2 rounded-md text-sm"
                          placeholder="e.g. Broken screen, late parcel"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Category</label>
                        <select
                          className="w-full bg-background border border-border p-2 rounded-md text-sm"
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value)}
                        >
                          <option>Sales</option>
                          <option>Shipping</option>
                          <option>Refund Request</option>
                          <option>Technical Issue</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Priority</label>
                      <div className="flex gap-4">
                        {["low", "medium", "high"].map((pr) => (
                          <label key={pr} className="flex items-center gap-1.5 text-xs capitalize cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              checked={ticketPriority === pr}
                              onChange={() => setTicketPriority(pr as any)}
                            />
                            {pr}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold mb-1 block">Detailed Message</label>
                      <textarea
                        className="w-full bg-background border border-border p-2 rounded-md text-sm min-h-[100px]"
                        placeholder="Please supply details to speed up resolution..."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                      />
                    </div>

                    <Button type="submit" disabled={submittingTicket}>
                      {submittingTicket ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Active Tickets List */}
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTickets ? (
                    <div className="text-center py-4 animate-pulse">Loading tickets...</div>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((tkt) => (
                        <div key={tkt._id} className="border border-border rounded-lg p-4 bg-muted/20 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">{tkt.subject} <span className="text-xs text-muted-foreground font-mono">({tkt._id})</span></p>
                            <p className="text-xs text-muted-foreground">Category: {tkt.category} | Priority: <span className="capitalize">{tkt.priority}</span></p>
                          </div>
                          <div>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                              tkt.status === 'closed' ? 'bg-red-100 text-red-800' :
                              tkt.status === 'open' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {tkt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No open tickets logged.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
