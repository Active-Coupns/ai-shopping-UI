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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://shopsmart-ai.com"),
  title: "ShopSmart AI - Intelligent Shopping Assistant & Lowest Price Deals",
  description: "Experience smart shopping. AI specifications analysis, verified discount coupons, and real-time lowest price comparison across Amazon, Flipkart, 1mg & more.",
  openGraph: {
    title: "ShopSmart AI — Smarter Shopping, Instant Price Comparison & Deals",
    description: "Compare lowest prices across Amazon, Flipkart, & top stores with Instant AI Review and Virtual Try-On.",
    url: "https://shopsmart-ai.com",
    siteName: "ShopSmart AI",
    images: [
      {
        url: "/laptop.jpg",
        width: 1200,
        height: 630,
        alt: "ShopSmart AI - Price Comparison & Smart Deals",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopSmart AI — Smarter Shopping, Instant Price Comparison & Deals",
    description: "Compare lowest prices across Amazon, Flipkart, & top stores with Instant AI Review.",
    images: ["/laptop.jpg"],
  },
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZWxlY3RyaWMtY3ViLTQ5NDQuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html
        lang="en"
        className={`${outfit.variable} ${inter.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body 
          className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-indigo/20 selection:text-brand-indigo-600"
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
