import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  pricePerBase: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,

  addItem: (item: CartItem) => {
    set((state: CartState) => {
      const existing = state.items.find((i: CartItem) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i: CartItem) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },

  removeItem: (id: string) => {
    set((state: CartState) => ({ items: state.items.filter((i: CartItem) => i.id !== id) }));
  },

  updateItemQuantity: (id: string, quantity: number) => {
    set((state: CartState) => ({
      items: state.items
        .map((i: CartItem) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i: CartItem) => i.quantity > 0),
    }));
  },

  clearCart: () => {
    set(() => ({ items: [] }));
  },

  setIsCartOpen: (open: boolean) => {
    console.log("[cart-store] setIsCartOpen ->", open);
    set(() => ({ isCartOpen: open }));
  },

  getSubtotal: () => {
    return get().items.reduce((sum: number, it: CartItem) => sum + it.pricePerBase * it.quantity, 0);
  },

  getTax: () => {
    return +(get().getSubtotal() * 0.12 || 0);
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax();
  },
}));