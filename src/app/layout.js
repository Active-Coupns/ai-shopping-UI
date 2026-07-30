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
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-100 selection:bg-brand-indigo/30 selection:text-brand-indigo-300">
        {children}
      </body>
    </html>
  );
}

