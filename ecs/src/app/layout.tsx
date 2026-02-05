import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
