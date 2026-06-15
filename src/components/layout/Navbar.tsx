"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    checkAuth();
  }, [checkAuth]);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden mr-2" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <div className="mt-8 mb-4">
              <form 
                className="relative w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-muted pl-9 rounded-full focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/products" className="text-lg font-medium">Products</Link>
              <Link href="/categories" className="text-lg font-medium">Categories</Link>
              <Link href="/deals" className="text-lg font-medium">Deals</Link>
              <Link href="/new-arrivals" className="text-lg font-medium">New Arrivals</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Menu
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mr-6">
          <Link href="/products" className="transition-colors hover:text-primary">Products</Link>
          <Link href="/categories" className="transition-colors hover:text-primary">Categories</Link>
          <Link href="/deals" className="transition-colors hover:text-primary">Deals</Link>
          <Link href="/new-arrivals" className="transition-colors hover:text-primary">New Arrivals</Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-auto hidden md:flex">
          <form 
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
              }
            }}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-muted pl-9 rounded-full focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="flex md:hidden rounded-full"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {mounted && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary overflow-hidden" />}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />
                  )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-bold truncate">Hello, {user?.name}</DropdownMenuLabel>
                  <span className="text-[10px] text-muted-foreground px-2 block capitalize font-medium">Role: {user?.role}</span>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                
                {/* Admin or Superadmin links */}
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer font-semibold text-primary">
                    🛡️ Admin Panel
                  </DropdownMenuItem>
                )}
                
                {/* Vendor links */}
                {(user?.role === 'vendor' || user?.role === 'admin' || user?.role === 'superadmin') && (
                  <DropdownMenuItem onClick={() => router.push('/vendor')} className="cursor-pointer">
                    🏪 Vendor Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                  👤 Customer Dashboard
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  logout();
                  router.refresh();
                }} className="cursor-pointer text-rose-600 focus:text-rose-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Search Bar (Collapsible) */}
      {isMobileSearchOpen && (
        <div className="border-t py-2 px-4 md:hidden bg-background">
          <form 
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                setIsMobileSearchOpen(false);
              }
            }}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-muted pl-9 rounded-full focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}
