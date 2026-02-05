"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useCartStore, type UOM } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import { useOrderStore } from "@/store/order-store";

const MOCK_PRODUCTS = [
  { id: "RAM-001", name: "Premium Tonkotsu Base", sku: "RAM-001", pricePerBase: 1250, category: "Noodles", imageUrl: "/resources/images/tonkotsu-base.jpg" },
  { id: "RAM-002", name: "Shoyu Soy Seasoning", sku: "RAM-002", pricePerBase: 450, category: "Seasoning", imageUrl: "/resources/images/shoyu-soy-seasoning.png" },
  { id: "DRK-001", name: "Matcha Powder 1kg", sku: "DRK-001", pricePerBase: 890, category: "Drinks", imageUrl: "/resources/images/matcha.jpg" },
  { id: "FOD-001", name: "Nori Sheets (50pcs)", sku: "FOD-001", pricePerBase: 320, category: "Add-ons", imageUrl: "/resources/images/norisheets.jpg" },
  { id: "RAM-003", name: "Egg Noodles (Box)", sku: "RAM-003", pricePerBase: 2100, category: "Noodles", imageUrl: "/resources/images/eggnoodles.jpg" },
  { id: "DRK-002", name: "Hojicha Tea Leaves", sku: "DRK-002", pricePerBase: 1100, category: "Drinks", imageUrl: "/resources/images/hojika.jpg" },
];

const CATEGORIES = ["All", "Noodles", "Seasoning", "Drinks", "Add-ons"];

export default function PlaceOrderPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cart Store Actions
  const {
    items: cartItems,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total
  } = useCartStore();

  // Order Store Actions
  const { addOrder } = useOrderStore();

  // Handle Order Submission
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    // Simulate Network Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newOrder = {
      id: `SO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      amount: total,
      status: "Pending" as const,
      items: [...cartItems]
    };

    addOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Logic to handle screen resizing for sidebar
  useEffect(() => {
    if (window.innerWidth < 1024) setIsCartOpen(false);
  }, []);

  const filteredProducts = useMemo(() =>
    MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    }), [search, category]);

  return (
    <div className="relative flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 scale-110">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Order Successful!</h2>
            <p className="text-slate-500 mt-2">Your order has been sent to history.</p>
            <Button onClick={() => setShowSuccess(false)} className="mt-6 bg-slate-900">Close</Button>
          </div>
        </div>
      )}

      {/* 1. CATALOG SECTION */}
      <section className="flex flex-1 flex-col min-w-0 bg-slate-50/50">
        <header className="z-10 border-b border-slate-200 bg-white/80 pt-4 px-4 pb-1 backdrop-blur-md md:pt-6 md:px-6 md:pb-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Place Your Order</h1>
              <p className="hidden text-xs text-slate-500 sm:block">Pay as you order your food.</p>
            </div>
            <div className="relative w-full sm:max-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-red-900/30 focus:ring-4 focus:ring-red-900/5"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${category === cat ? "bg-red-900 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-red-900/30"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl hover:border-red-100">
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <div className="mb-2">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 md:text-sm">{product.name}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.sku}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-900 md:text-base">₱{product.pricePerBase.toLocaleString()}</span>
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-red-900 px-3 text-[11px] font-bold hover:bg-red-800"
                      onClick={() => addItem({ ...product, uom: "PACK" })}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. RESPONSIVE TOGGLE HANDLE (Desktop Only) */}
      <div className="hidden lg:relative lg:z-30 lg:flex lg:w-1 lg:items-center lg:justify-center lg:bg-slate-200">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="absolute flex h-20 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md transition-all hover:h-28 hover:text-red-900"
        >
          {isCartOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* 3. CART SIDEBAR */}
      <aside className={`fixed inset-0 z-[60] flex flex-col bg-white transition-all duration-500 ease-in-out lg:relative lg:inset-auto lg:z-20 ${isCartOpen ? "translate-x-0 opacity-100 lg:w-[380px]" : "translate-x-full opacity-0 lg:w-0 lg:translate-x-0"}`}>
        <div className="flex h-full w-full flex-col shadow-2xl lg:shadow-none">
          <header className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-900/10 p-2">
                <ShoppingBag className="h-5 w-5 text-red-900" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Your Order</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => clearCart()} className="text-[10px] font-bold uppercase text-slate-400">Clear</Button>
              <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2"><X className="h-5 w-5" /></button>
            </div>
          </header>

          {/* RESTORED CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-30">
                <ShoppingBag className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="group flex gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-red-100">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-2">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 p-1">
                        <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="p-0.5"><Minus className="h-3 w-3" /></button>
                        <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="p-0.5"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-xs font-black text-slate-900">₱{(item.pricePerBase * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="border-t border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="space-y-1.5">
              {/* Subtotal */}
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Tax Rate Line */}
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Tax (12%)</span>
                <span>₱{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200/50">
                <span>Grand Total</span>
                <span>₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Button
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handleSubmitOrder}
              className="w-full h-12 bg-red-900 text-white hover:bg-red-800 rounded-xl shadow-xl shadow-red-900/20 text-sm font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
              ) : (
                "Submit Order"
              )}
            </Button>
          </footer>
        </div>
      </aside>
    </div>
  );
}