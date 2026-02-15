"use client";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "../store/cart-store";

export default function LiveCartBadge() {
  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemTypeCount = items.length;

  const handleClick = () => {
    if (!items.length) return;
    setIsCartOpen(true);
    if (pathname !== "/place-order") router.push("/place-order");
  };

  return (
    <button
      id="live-cart-badge"
      onClick={handleClick}
      aria-label={items.length ? "Open cart" : "Cart is empty"}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition ${
        items.length
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border-slate-200 bg-slate-100 text-slate-400"
      }`}
    >
      <span className="font-bold">{itemTypeCount} item types</span>
      <span className="text-[10px] opacity-80">{totalQuantity} qty</span>
      <span className="font-bold">
        ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </button>
  );
}
