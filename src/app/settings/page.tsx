"use client";

import { useState, useEffect, Suspense, useRef } from "react"; // Added useEffect
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
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

function ScrollableTable({
  children,
  buttonAriaLabel,
}: {
  children: React.ReactNode;
  buttonAriaLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth - el.clientWidth > 8;
    const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setCanScroll(hasOverflow);
    setAtEnd(reachedEnd);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const handleToggleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: atEnd ? 0 : el.scrollWidth - el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div ref={scrollRef} onScroll={updateScrollState} className="overflow-x-auto pr-12">
        {children}
      </div>
      {canScroll && (
        <button
          type="button"
          onClick={handleToggleScroll}
          aria-label={buttonAriaLabel}
          className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-2 text-slate-500 shadow-md backdrop-blur transition hover:bg-slate-50"
        >
          {atEnd ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

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
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center print:bg-white print:p-0 print:backdrop-blur-none">
          <div className="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl print:max-h-none print:rounded-none print:shadow-none sm:my-0">
            {/* Modal Header (Hidden on Print) */}
            <div className="flex items-center justify-between border-b p-4 print:hidden sm:p-6">
              <h2 className="font-bold text-lg">System Generated Report</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"><Printer className="h-5 w-5" /></button>
                <button onClick={() => setShowReport(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Modal Content (Printable Area) */}
            <div className="flex-1 overflow-y-auto p-4 print:overflow-visible sm:p-8">
              <div className="mb-6 flex flex-col gap-4 border-b-2 border-slate-900 pb-6 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-black uppercase italic text-red-900 sm:text-2xl">Ramen Heaven POS</h1>
                  <p className="text-xs text-slate-500">Executive Summary Report • {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-left text-xs sm:text-right">
                  <p className="font-bold">Total Confirmed Revenue</p>
                  <p className="text-xl font-black text-slate-900">₱{totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Approved</p>
                  <p className="text-lg font-bold sm:text-xl">{statusCounts.Approved}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Pending</p>
                  <p className="text-lg font-bold sm:text-xl">{statusCounts.Pending}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Rejected</p>
                  <p className="text-lg font-bold sm:text-xl">{statusCounts.Rejected}</p>
                </div>
              </div>

              <ScrollableTable buttonAriaLabel="Scroll report table horizontally">
                <table className="w-full min-w-[520px] text-left text-[11px] sm:text-sm">
                  <thead className="border-b-2 border-slate-100">
                    <tr>
                      <th className="py-2 pr-2">Order ID</th>
                      <th className="pr-2">Date</th>
                      <th className="pr-2">Status</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="py-3 pr-2 font-medium">{order.id}</td>
                        <td className="pr-2 text-slate-500 whitespace-nowrap">{order.date}</td>
                        <td className="pr-2 text-xs font-bold whitespace-nowrap">{order.status}</td>
                        <td className="text-right tabular-nums whitespace-nowrap">₱{order.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollableTable>
            </div>
          </div>
        </div>
      )}

      {/* 2. PO REQUEST MODAL */}
      {showPO && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center print:bg-white">
          <div className="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl print:rounded-none print:shadow-none sm:my-0">
            <div className="flex items-center justify-between border-b p-4 print:hidden sm:p-6">
              <h2 className="font-bold text-lg">Purchase Order Preview</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-rose-600 text-white hover:bg-rose-700 rounded-lg"><Printer className="h-5 w-5" /></button>
                <button onClick={() => setShowPO(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10">
              <div className="mb-6 text-center sm:mb-8">
                <h1 className="text-2xl font-black sm:text-3xl">PURCHASE ORDER</h1>
                <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Pending Submission</p>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 text-xs sm:mb-8 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p className="font-bold uppercase text-slate-400 mb-1">From:</p>
                  <p className="font-bold">Handrian / Ramen Heaven</p>
                  <p>Newly Registered Store Administration</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold uppercase text-slate-400 mb-1">Date:</p>
                  <p className="font-bold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-8">
                <ScrollableTable buttonAriaLabel="Scroll purchase order table horizontally">
                  <table className="w-full min-w-[520px] text-[11px] sm:text-xs">
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
                          <td className="p-2 text-center whitespace-nowrap">{item.quantity}</td>
                          <td className="p-2 text-right whitespace-nowrap">₱{item.pricePerBase.toLocaleString()}</td>
                          <td className="p-2 text-right font-bold whitespace-nowrap">₱{(item.quantity * item.pricePerBase).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-900">
                        <td colSpan={3} className="p-2 font-bold text-right">TOTAL REQUEST AMOUNT</td>
                        <td className="p-2 font-black text-right text-lg whitespace-nowrap">
                          ₱{cartItems.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerBase), 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </ScrollableTable>
              </div>
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl sm:my-0">
            <div className="absolute top-4 right-4 z-10">
              {/* Note: onClose, we might want to clear the URL param so it doesn't reopen on refresh */}
              <button
                onClick={() => setShowDev(false)}
                className="p-2 bg-white/80 backdrop-blur shadow-sm hover:bg-white rounded-full text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-20 w-full bg-gradient-to-br from-red-900 via-rose-950 to-black sm:h-24" />

            <div className="relative px-6 pb-8 pt-3 text-center sm:px-8 sm:pt-4">
              <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-xl sm:mx-0 sm:h-24 sm:w-24">
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
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Engr. Mhel Handrian A. Pineda</h2>
                <p className="text-rose-600 font-bold text-xs uppercase tracking-widest">R&D Systems Engineer • Lead Architect</p>
              </div>

              <div className="mx-auto mt-6 max-w-[34ch] space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  Mhel Handrian is a <strong>Research & Development Systems Engineer</strong> with over a decade of experience in industrial applications.
                  He has spearheaded software engineering projects for international firms like <em>CITCO International</em> and <em>Alliant Insurance Services</em>,
                  specializing in AI integration (OCR/NLP) and high-performance web stacks.
                </p>
                <p>
                  As an alumnus of <strong>STI College</strong> and a seasoned professional in both local and overseas tech markets,
                  he currently focuses on empowering SMEs through bespoke digital solutions and automated POS systems like <em>Ramen Heaven</em>.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-6 sm:gap-4">
                <a href="https://linkedin.com/in/mhel-handrian-pineda" target="_blank" className="flex items-center gap-2 text-[11px] font-bold text-slate-400 transition-colors hover:text-blue-600 sm:text-xs">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href="mailto:handrianmhel@gmail.com" className="flex items-center gap-2 text-[11px] font-bold text-slate-400 transition-colors hover:text-rose-600 sm:text-xs">
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