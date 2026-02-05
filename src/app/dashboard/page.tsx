"use client";

import { useOrderStore } from "@/store/order-store";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ArrowUpRight, Clock, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  const { orders } = useOrderStore();
  const router = useRouter();

  // --- CALCULATIONS ---
  const approvedOrders = orders.filter((o) => o.status === "Approved");
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const rejectedOrders = orders.filter((o) => o.status === "Rejected");

  const totalApprovedVal = approvedOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalPendingVal = pendingOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalRejectedVal = rejectedOrders.reduce((sum, o) => sum + o.amount, 0);

  // Chart Data: Showing the price per order over time (reversed to show oldest to newest)
  const chartData = [...orders].reverse().map((o) => ({
    id: o.id.slice(-4), // Last 4 digits for cleaner X-axis
    amount: o.amount,
  }));

  return (
    <section className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-rose-600">
          Your Patronage Overview
        </h1>
        <p className="text-sm text-slate-500">
          Real-time performance metrics derived from order history.
        </p>
      </header>

      {/* --- KPI CARDS --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Approved Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Approved Revenue</div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₱{totalApprovedVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1 uppercase italic">Confirmed Sales</div>
        </div>

        {/* Pending Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Value</div>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₱{totalPendingVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-600 font-bold mt-1 uppercase italic">In Queue</div>
        </div>

        {/* Rejected Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rejected Total</div>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 text-slate-400">
            ₱{totalRejectedVal.toLocaleString()}
          </div>
          <div className="text-[10px] text-red-400 font-bold mt-1 uppercase italic">Voided/Failed</div>
        </div>

        {/* Pending Count (Redirect Trigger) */}
        <button
          onClick={() => router.push("/order-history")}
          disabled={pendingOrders.length === 0}
          className={`group relative rounded-2xl border p-4 shadow-sm transition-all text-left
            ${pendingOrders.length > 0
              ? "border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 cursor-pointer"
              : "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
            }`}
        >
          <div className="flex justify-between items-start">
            <div className={`text-[10px] font-bold uppercase tracking-widest ${pendingOrders.length > 0 ? "text-red-800" : "text-slate-500"}`}>
              Pending Orders
            </div>
            {pendingOrders.length > 0 && (
              <ArrowUpRight className="h-4 w-4 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </div>

          <div className={`mt-2 text-3xl font-black ${pendingOrders.length > 0 ? "text-red-900" : "text-slate-400"}`}>
            {pendingOrders.length}
          </div>

          <div className={`text-[10px] font-bold mt-1 uppercase flex items-center gap-1 ${pendingOrders.length > 0 ? "text-red-700" : "text-slate-400"}`}>
            {pendingOrders.length > 0 ? (
              <>Click to take action <ShoppingBag className="h-3 w-3" /></>
            ) : (
              <>No pending actions</>
            )}
          </div>
        </button>
      </div>

      {/* --- VISUALIZATION SECTION --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Order Velocity & Volume</h2>
          <p className="text-xs text-slate-500 italic">Comparison of transaction amounts per unique Order ID</p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="id"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(value) => `₱${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number | undefined) => value ? [`₱${value.toLocaleString()}`, "Order Amount"] : ['', "Order Amount"]}
                labelFormatter={(label) => `Order ID: ...${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#991b1b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#991b1b', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}