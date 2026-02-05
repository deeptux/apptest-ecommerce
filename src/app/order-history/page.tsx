"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Added for product images
import { useOrderStore, Order } from "@/store/order-store";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { X, Package, Calendar, Check, RotateCcw, Ban } from "lucide-react"; // Added Icons

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[status]}`}>
      {status}
    </span>
  );
}

export default function OrderHistoryPage() {
  const { orders, clearHistory, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-900" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-4 md:gap-6 relative">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">Transaction History</h1>
        <p className="text-sm text-slate-500">Click any order to view detailed line items.</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Showing {orders.length} orders</span>

          {/* Wrap the button in a div to align it right */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (confirm("Wipe all transaction history?")) clearHistory();
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors"
            >
              Clear All History
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-3">
        <Table>
          <THead>
            <TR>
              <TH>Order ID</TH>
              <TH>Date</TH>
              <TH>Orders</TH>
              <TH className="text-right">Amount</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {orders.map((order) => {
              // Create the string of product names
              const productNames = order.items?.map(item => item.name).join("; ") || "No items";

              return (
                <TR
                  key={order.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TD className="font-medium text-slate-900 group-hover:text-red-900">{order.id}</TD>
                  <TD className="text-xs text-slate-600 whitespace-nowrap">{order.date}</TD>

                  {/* New Column: Orders Summary */}
                  <TD className="max-w-[200px]">
                    <p className="text-xs text-slate-500 truncate" title={productNames}>
                      {productNames}
                    </p>
                  </TD>

                  <TD className="text-right text-sm font-semibold tabular-nums text-slate-900">
                    ₱{order.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </TD>
                  <TD><StatusBadge status={order.status} /></TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Order Details</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* DATE, ACTIONS, STATUS ROW */}
              <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.date}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Approved")}
                    title="Approve"
                    className={`p-1.5 rounded-lg transition-all ${selectedOrder.status === 'Approved' ? 'bg-green-600 text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-green-600'}`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Pending")}
                    title="Set to Pending"
                    className={`p-1.5 rounded-lg transition-all ${selectedOrder.status === 'Pending' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-amber-500'}`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "Rejected")}
                    title="Reject"
                    className={`p-1.5 rounded-lg transition-all ${selectedOrder.status === 'Rejected' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-red-600'}`}
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                </div>

                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>

            {/* Modal Body - Items List with Images */}
            <div className="p-6 max-h-[45vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Package className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Line Items</span>
              </div>

              <div className="space-y-5">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    {/* Image Container */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {item.quantity} × ₱{item.pricePerBase.toLocaleString()} ({item.uom})
                      </p>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        ₱{(item.quantity * item.pricePerBase).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer - Totals */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Grand Total</span>
                <span className="text-xl font-black text-red-900">
                  ₱{selectedOrder.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 text-right font-medium">Tax Included (12%)</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}