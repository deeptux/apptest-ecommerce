import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cart-store";

export interface Order {
  id: string;
  date: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
  items: CartItem[]; // This makes items REQUIRED
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: "Approved" | "Pending" | "Rejected") => void;
  clearHistory: () => void;
}


export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      // Updated demo data with empty item arrays to satisfy the interface
      orders: [
        { 
          id: "SO-2026-00182", 
          date: "2026-02-05", 
          amount: 182950, 
          status: "Approved", 
          items: [] 
        },
        { 
          id: "SO-2026-00179", 
          date: "2026-02-05", 
          amount: 64220, 
          status: "Pending", 
          items: [] 
        },
        { 
          id: "SO-2026-00175", 
          date: "2026-02-04", 
          amount: 28440, 
          status: "Rejected", 
          items: [] 
        },
      ],

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { ...o, status } : o
        )
      })),

      addOrder: (order) => 
        set((state) => ({ 
          orders: [order, ...state.orders] 
        })),

      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: "order-history-storage", // Key in LocalStorage
    }
  )
);