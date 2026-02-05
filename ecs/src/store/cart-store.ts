// @/store/cart-store.ts
import { create } from "zustand";

export type UOM = "PACK" | "KG" | "BAG";

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  pricePerBase: number;
  uom: UOM;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  taxRate: number;
  subtotal: number; // Changed to state
  tax: number;      // Changed to state
  total: number;    // Changed to state
  addItem: (payload: any) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

function uomFactor(uom: UOM) {
  switch (uom) {
    case "KG": return 1.2;
    case "BAG": return 8;
    default: return 1;
  }
}

// Helper to calculate totals
const calculateTotals = (items: CartItem[], taxRate: number) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.pricePerBase * uomFactor(item.uom) * (item.quantity || 0),
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  taxRate: 0.12,
  subtotal: 0,
  tax: 0,
  total: 0,

  addItem: (payload) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === payload.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...payload, quantity: 1 }];
      }
      return { 
        items: newItems, 
        ...calculateTotals(newItems, state.taxRate) 
      };
    }),

  updateItemQuantity: (id, quantity) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      return { 
        items: newItems, 
        ...calculateTotals(newItems, state.taxRate) 
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      return { 
        items: newItems, 
        ...calculateTotals(newItems, state.taxRate) 
      };
    }),

  clearCart: () => set({ items: [], subtotal: 0, tax: 0, total: 0 }),
}));