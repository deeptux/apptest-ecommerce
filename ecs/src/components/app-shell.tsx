"use client";

import { useState, useEffect } from 'react';
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import {
  LayoutDashboard,
  ShoppingCart,
  History,
  Settings,
  Menu,
  X
} from "lucide-react";
import { LiveCartBadge } from "@/components/live-cart-badge";
import { useCartStore } from "@/store/cart-store"; // Added to check cart count
import Image from 'next/image';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/place-order", label: "Place Order", icon: ShoppingCart },
  { href: "/order-history", label: "Order History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

function SidebarNav({ isCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // This function now runs every time the URL changes
    const checkAuth = () => {
      const hasToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('app_session='));
      
      setIsLoggedIn(!!hasToken);
    };

    checkAuth();
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay Background */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800/60 
          bg-gradient-to-br from-red-900 via-rose-950 to-black text-slate-100 
          shadow-xl transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-[78px]" : "md:w-64 w-64"}
        `}
      >
        {/* Branding Area */}
        <div className="flex h-20 items-center overflow-hidden px-4">
          <div className="flex min-w-[46px] items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm p-2">
            <Image
              src="/resources/images/company-logo.png"
              alt="Logo"
              className="h-6 w-6 shrink-0"
              width={24} height={24}
            />
          </div>
          <div className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"}`}>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">Ramen Heaven</div>
            <div className="text-lg font-bold text-slate-50">Online Kitchen</div>
          </div>

          {/* Mobile Close Button */}
          <button onClick={() => setMobileOpen(false)} className="ml-auto p-2 md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 px-3 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all
                  ${active ? "bg-white/10 text-rose-50 shadow-inner" : "text-rose-100/80 hover:bg-white/5 hover:text-rose-50"}
                `}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/20 text-rose-100 group-hover:bg-black/30 transition-colors`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Area */}
        <div className="p-4 border-t border-white/10 space-y-2">

          {/* ONLY SHOW LOGOUT IF LOGGED IN */}
          {isLoggedIn && (
            <button
              onClick={() => {
                document.cookie = "app_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = "/login";
              }}
              className={`
              group flex items-center w-full rounded-xl px-3 py-2.5 text-sm font-medium 
              text-rose-200/70 hover:bg-red-500/20 hover:text-white transition-all
              ${isCollapsed ? "justify-center" : ""}
            `}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              {!isCollapsed && <span className="ml-3 font-semibold tracking-wide">Sign Out</span>}
            </button>
          )}

          {/* Credits */}
          <div className={`text-[9px] text-rose-300/30 text-center uppercase tracking-tighter transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
            For Demo Purposes Only <br />
            Handrian © 2023
          </div>
        </div>

      </aside>
    </>
  );
}

const getPageTitle = (pathname: string) => {
  const item = navItems.find((item) => item.href === pathname);
  return item ? item.label : "Store Administration";
};

const handleLogout = () => {
  // Clear the session cookie by setting expiry to the past
  document.cookie = "app_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/login"; // Force full reload to trigger middleware
};

export function AppShellLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore(); // Access cart items

  const cartItemCount = items.length;

  // Close sidebar automatically if screen is resized to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCartClick = () => {
    if (cartItemCount > 0) {
      router.push("/place-order");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 h-screen">
      {/* Sidebar Component */}
      <SidebarNav
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`flex flex-1 flex-col transition-all duration-300 h-full overflow-y-auto ${isCollapsed ? "md:ml-[78px]" : "md:ml-64"}`}>

        {/* Shell Header */}
        <header className="sticky top-0 z-30 flex h-16 pt-2 pb-2 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Menu className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg bg-red-900 text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* DYNAMIC HEADING */}
            <h2 className="hidden sm:block text-sm font-bold text-slate-800 tracking-tight transition-all">
              {getPageTitle(pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* CLICKABLE CART BADGE */}
            <div
              onClick={handleCartClick}
              className={`transition-all ${cartItemCount > 0 ? "cursor-pointer active:scale-90" : "cursor-not-allowed opacity-50"}`}
              title={cartItemCount > 0 ? "View Cart" : "Cart is empty"}
            >
              <LiveCartBadge />
            </div>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* CLICKABLE USER PROFILE */}
            <Link
              href="/settings?open=dev"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-4 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-slate-900 overflow-hidden">
                {/* Optional: Add a small profile pic or initials */}
                <div className="flex h-full w-full items-center justify-center text-[10px] text-white font-bold">MH</div>
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-[11px] font-bold leading-none text-slate-900">Handrian</span>
                <span className="text-[9px] text-slate-500">Newly Registered</span>
              </div>
            </Link>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}