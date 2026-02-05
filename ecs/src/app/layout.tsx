import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShellLayout } from "@/components/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shiny Velvet Commerce",
  description: "High-performance B2B e-commerce & POS demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-50">
      <body
        className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <AppShellLayout>{children}</AppShellLayout>
      </body>
    </html>
  );
}
