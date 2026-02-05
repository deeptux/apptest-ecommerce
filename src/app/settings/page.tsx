"use client";

import { useState, useEffect, Suspense } from "react"; // Added useEffect
import { useSearchParams } from "next/navigation"; // Added useSearchParams
import { useOrderStore } from "@/store/order-store";
import { useCartStore } from "@/store/cart-store";
import {
  FileText,
  Printer,
  X,
  ClipboardCheck,
  TrendingUp,
  Code2,
  Linkedin,
  Mail
} from "lucide-react";
import Image from "next/image";

function SettingsContent() {
  const searchParams = useSearchParams();
  const openParam = searchParams.get('open');

  const { orders } = useOrderStore();
  const { items: cartItems } = useCartStore();

  const [showReport, setShowReport] = useState(false);
  const [showPO, setShowPO] = useState(false);
  const [showDev, setShowDev] = useState(false); // New state for Developer Modal

  // Trigger modal if URL contains ?open=dev
  useEffect(() => {
    if (openParam === 'dev') {
      setShowDev(true);
    }
  }, [openParam]);

  // --- REPORT CALCULATIONS ---
  const totalRevenue = orders
    .filter(o => o.status === "Approved")
    .reduce((sum, o) => sum + o.amount, 0);

  const statusCounts = {
    Approved: orders.filter(o => o.status === "Approved").length,
    Pending: orders.filter(o => o.status === "Pending").length,
    Rejected: orders.filter(o => o.status === "Rejected").length,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="flex flex-1 flex-col gap-4 md:gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">Settings & Reporting</h1>
        <p className="text-sm text-slate-500">
          Generate business documents and monitor administrative controls.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3"> {/* Changed to 3 columns */}
        {/* Report Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Business Report</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6 flex-1">
            Summary of all historical transactions, revenue totals, and status distributions.
          </p>
          <button
            onClick={() => setShowReport(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
          >
            <FileText className="h-4 w-4" /> View Report
          </button>
        </div>

        {/* PO Request Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Purchase Order</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6 flex-1">
            Create a printable PO based on the items currently in your "Place Order" cart.
          </p>
          <button
            onClick={() => setShowPO(true)}
            disabled={cartItems.length === 0}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors
              ${cartItems.length > 0
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            <Printer className="h-4 w-4" /> {cartItems.length > 0 ? "Generate PO" : "Cart is Empty"}
          </button>
        </div>

        {/* Developer Info Card (New) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
            <Code2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Meet the Developer</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6 flex-1">
            Information about the lead systems engineer and technical architect of this platform.
          </p>
          <button
            onClick={() => setShowDev(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. ANALYTICS REPORT MODAL */}
      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:p-0 print:bg-white print:backdrop-blur-none">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col print:shadow-none print:max-h-none print:rounded-none">
            {/* Modal Header (Hidden on Print) */}
            <div className="p-6 border-b flex justify-between items-center print:hidden">
              <h2 className="font-bold text-lg">System Generated Report</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"><Printer className="h-5 w-5" /></button>
                <button onClick={() => setShowReport(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Modal Content (Printable Area) */}
            <div className="p-8 overflow-y-auto flex-1 print:overflow-visible">
              <div className="flex justify-between border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                  <h1 className="text-2xl font-black uppercase italic text-red-900">Ramen Heaven POS</h1>
                  <p className="text-xs text-slate-500">Executive Summary Report • {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">Total Confirmed Revenue</p>
                  <p className="text-xl font-black text-slate-900">₱{totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Approved</p>
                  <p className="text-xl font-bold">{statusCounts.Approved}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Pending</p>
                  <p className="text-xl font-bold">{statusCounts.Pending}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Rejected</p>
                  <p className="text-xl font-bold">{statusCounts.Rejected}</p>
                </div>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-slate-100">
                  <tr>
                    <th className="py-2">Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="text-slate-500">{order.date}</td>
                      <td className="text-xs font-bold">{order.status}</td>
                      <td className="text-right tabular-nums">₱{order.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PO REQUEST MODAL */}
      {showPO && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:bg-white">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col print:shadow-none print:rounded-none">
            <div className="p-6 border-b flex justify-between items-center print:hidden">
              <h2 className="font-bold text-lg">Purchase Order Preview</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-rose-600 text-white hover:bg-rose-700 rounded-lg"><Printer className="h-5 w-5" /></button>
                <button onClick={() => setShowPO(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="p-10 flex-1">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black">PURCHASE ORDER</h1>
                <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Pending Submission</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                  <p className="font-bold uppercase text-slate-400 mb-1">From:</p>
                  <p className="font-bold">Handrian / Ramen Heaven</p>
                  <p>Newly Registered Store Administration</p>
                </div>
                <div className="text-right">
                  <p className="font-bold uppercase text-slate-400 mb-1">Date:</p>
                  <p className="font-bold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <table className="w-full text-xs mb-8">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">₱{item.pricePerBase.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">₱{(item.quantity * item.pricePerBase).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900">
                    <td colSpan={3} className="p-2 font-bold text-right">TOTAL REQUEST AMOUNT</td>
                    <td className="p-2 font-black text-right text-lg">
                      ₱{cartItems.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerBase), 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="mt-12 pt-8 border-t border-dashed border-slate-200 text-center">
                <div className="inline-block border-b border-slate-900 w-48 mb-2"></div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEVELOPER PROFILE MODAL */}
      {showDev && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              {/* Note: onClose, we might want to clear the URL param so it doesn't reopen on refresh */}
              <button
                onClick={() => setShowDev(false)}
                className="p-2 bg-white/80 backdrop-blur shadow-sm hover:bg-white rounded-full text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-32 bg-gradient-to-br from-red-900 via-rose-950 to-black w-full" />

            <div className="px-8 pb-8 -mt-12 relative">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl mb-4 overflow-hidden border border-slate-100">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <Image
                    src="/resources/images/dev.jpg"
                    alt="Engr. Handrian"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900">Engr. Mhel Handrian A. Pineda</h2>
                <p className="text-rose-600 font-bold text-xs uppercase tracking-widest">R&D Systems Engineer • Lead Architect</p>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Mhel Handrian is a <strong>Research & Development Systems Engineer</strong> with over a decade of experience in industrial applications.
                  He has spearheaded software engineering projects for international firms like <em>CITCO International</em> and <em>Alliant Insurance Services</em>,
                  specializing in AI integration (OCR/NLU) and high-performance web stacks.
                </p>
                <p>
                  As an alumnus of <strong>STI College</strong> and a seasoned professional in both local and overseas tech markets,
                  he currently focuses on empowering SMEs through bespoke digital solutions and automated POS systems like <em>Ramen Heaven</em>.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                <a href="https://linkedin.com/in/mhel-handrian-pineda" target="_blank" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href="mailto:handrianmhel@gmail.com" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors">
                  <Mail className="h-4 w-4" /> Contact Developer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>

  );
}

export default function SettingsPage() {
  return (
    // This allows Next.js to skip pre-rendering the search param logic
    <Suspense fallback={<div className="p-8 text-slate-500">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}