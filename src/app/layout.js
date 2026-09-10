import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopSmart AI - Intelligent Shopping Assistant",
  description: "Experience the future of smart shopping. AI-powered specifications matching, affiliate coupons, and real-time comparison across Amazon, Flipkart, & more.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-indigo/20 selection:text-brand-indigo-600">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
