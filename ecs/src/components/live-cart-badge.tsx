import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function LiveCartBadge() {
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const total = useCartStore((s) => s.total);

  return (
    <button
      type="button"
      className="group inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1.5 text-xs font-medium text-rose-900 shadow-sm backdrop-blur-md transition hover:bg-rose-100"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-rose-50 shadow-md">
        <ShoppingCart className="h-4 w-4" />
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[11px] uppercase tracking-[0.16em] text-rose-700/80">
          Live Cart
        </span>
        <span>
          {itemCount} items ·{" "}
          <span className="tabular-nums">
            ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        </span>
      </span>
    </button>
  );
}

