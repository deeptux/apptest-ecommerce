"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Loader2,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/store/cart-store";

const MOCK_PRODUCTS = [
  {
    id: "RAM-001",
    name: "Premium Tonkotsu Base",
    sku: "RAM-001",
    pricePerBase: 1250,
    category: "Noodles",
    imageUrl: "/resources/images/tonkotsu-base.jpg",
  },
  {
    id: "RAM-002",
    name: "Shoyu Soy Seasoning",
    sku: "RAM-002",
    pricePerBase: 450,
    category: "Seasoning",
    imageUrl: "/resources/images/shoyu-soy-seasoning.png",
  },
  {
    id: "DRK-001",
    name: "Matcha Powder 1kg",
    sku: "DRK-001",
    pricePerBase: 890,
    category: "Drinks",
    imageUrl: "/resources/images/matcha.jpg",
  },
  {
    id: "FOD-001",
    name: "Nori Sheets (50pcs)",
    sku: "FOD-001",
    pricePerBase: 320,
    category: "Add-ons",
    imageUrl: "/resources/images/norisheets.jpg",
  },
  {
    id: "RAM-003",
    name: "Egg Noodles (Box)",
    sku: "RAM-003",
    pricePerBase: 2100,
    category: "Noodles",
    imageUrl: "/resources/images/eggnoodles.jpg",
  },
  {
    id: "DRK-002",
    name: "Hojicha Tea Leaves",
    sku: "DRK-002",
    pricePerBase: 1100,
    category: "Drinks",
    imageUrl: "/resources/images/hojika.jpg",
  },
];

const CATEGORIES = ["All", "Noodles", "Seasoning", "Drinks", "Add-ons"];

type Product = {
  id?: string;
  sku?: string;
  name: string;
  price?: number;
  pricePerBase?: number;
  imageUrl?: string;
  image?: string;
};

export default function PlaceOrderPage() {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const total = useCartStore((s) => s.getTotal());
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const products: Product[] = Array.isArray(MOCK_PRODUCTS)
    ? (MOCK_PRODUCTS as Product[])
    : [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isCartOpen && window.innerWidth <= 667) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    console.log("[PlaceOrderPage] isCartOpen =", isCartOpen);
  }, [isCartOpen]);

  const handleAdd = (p: Product) => {
    addItem({
      id: String(p.id ?? p.sku ?? p.name),
      name: p.name,
      quantity: 1,
      pricePerBase: Number(p.price ?? p.pricePerBase ?? 0),
      imageUrl: p.imageUrl ?? p.image ?? undefined,
    });
    setIsCartOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (!cartItems.length) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setShowSuccess(true);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="relative flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* Always-available cart chevron toggle. Stays visible on small screens. */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className={`fixed top-1/2 z-[1300] -translate-y-1/2 rounded-full border border-rose-200 bg-white/95 p-2 text-rose-700 shadow-lg backdrop-blur transition hover:bg-rose-50 active:scale-95 ${
          isCartOpen ? "right-3 lg:right-[424px]" : "right-3"
        }`}
        aria-label={isCartOpen ? "Close cart panel" : "Open cart panel"}
        title={isCartOpen ? "Hide cart" : "Show cart"}
      >
        {isCartOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      {/* MAIN: product list (keeps existing content / MOCK_PRODUCTS usage) */}
      <main className="flex-1 overflow-auto p-4 pr-8 sm:p-6">
        {" "}
        {/* increased pr so content + buttons don't sit under scrollbar */}
        <h1 className="text-lg font-bold mb-4">Place Order</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const imgSrc = p.imageUrl ?? p.image;
            const key = `${p.id ?? p.name}`;

            return (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-lg border p-3 pr-6"
              >
                <div className="h-28 w-full overflow-hidden rounded-md bg-slate-100">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={p.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    #{p.sku ?? p.id}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-black">
                      ₱{Number(p.price ?? p.pricePerBase ?? 0).toLocaleString()}
                    </p>

                    <Button
                      size="sm"
                      onClick={() => handleAdd(p)}
                      className="ml-2 bg-rose-600 text-white"
                      aria-label={`Add ${p.name} to cart`}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* CART SIDEBAR / MOBILE OVERLAY */}
      <aside
        className={`fixed inset-y-0 right-0 z-[1150] flex w-full max-w-md flex-col bg-white transition-all duration-300 ease-in-out ${
          isCartOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        } lg:w-[420px]`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex h-full w-full flex-col shadow-2xl lg:shadow-none">
          <header className="sticky top-0 z-[1200] flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-900/10 p-2">
                <ShoppingBag className="h-5 w-5 text-red-900" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Your Order
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearCart()}
                className="text-[10px] font-bold uppercase text-slate-400"
              >
                Clear
              </Button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="lg:hidden p-2 z-[100]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-30">
                <ShoppingBag className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            ) : (
              (cartItems as CartItem[]).map((item: CartItem) => (
                <div
                  key={item.id}
                  className="group flex gap-3 rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 p-1">
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                          className="p-0.5"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity + 1)
                          }
                          className="p-0.5"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        ₱{(item.pricePerBase * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="border-t border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Subtotal</span>
                <span>
                  ₱
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Tax (12%)</span>
                <span>
                  ₱{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200/50">
                <span>Grand Total</span>
                <span>
                  ₱
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <Button
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handleSubmitOrder}
              className="w-full h-12 bg-red-900 text-white hover:bg-red-800 rounded-xl shadow-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Order"
              )}
            </Button>
            {showSuccess && (
              <p className="text-center text-sm text-green-600">
                Order submitted.
              </p>
            )}
          </footer>
        </div>
      </aside>
    </div>
  );
}
