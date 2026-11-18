import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { GlobalClientTelemetry } from "@/components/ZeroCostTelemetry";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const defaultBaseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.benefisto.com");

export const metadata = {
  metadataBase: new URL(defaultBaseUrl),
  manifest: "/manifest.json",
  alternates: {
    canonical: defaultBaseUrl,
    languages: {
      "en-IN": `${defaultBaseUrl}?country=IN`,
      "en-US": `${defaultBaseUrl}?country=US`,
      "en-GB": `${defaultBaseUrl}?country=GB`,
      "en-CA": `${defaultBaseUrl}?country=CA`,
      "en-AU": `${defaultBaseUrl}?country=AU`,
      "en-AE": `${defaultBaseUrl}?country=AE`,
      "x-default": defaultBaseUrl,
    },
  },
  title: "Benefisto - AI Shopping Co-Pilot, Virtual Trial Room, Price Comparison & Verified Deals",
  description: "All-in-one AI shopping decision platform: AI Virtual Trial Room fashion draping, AI Hardware Trust Sheet specs auditor, verified flight & hotel savings blueprints, movie BOGO tickets, software subscription discounts, and live lowest price comparison across Amazon, Flipkart, & top stores.",
  openGraph: {
    title: "Benefisto — AI Shopping Co-Pilot, Virtual Trial Room & Lowest Deals",
    description: "Compare lowest prices across Amazon, Flipkart, & top stores with AI Hardware Trust Sheet, Virtual Try-On, and verified flight & event savings.",
    url: defaultBaseUrl,
    siteName: "Benefisto",
    images: [
      {
        url: "/laptop.jpg",
        width: 1200,
        height: 630,
        alt: "Benefisto - Price Comparison & Smart Deals",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benefisto — AI Shopping Co-Pilot, Virtual Trial Room & Deals",
    description: "Experience AI shopping: Virtual Trial Room, Hardware Trust Sheet, flight savings blueprints & instant price comparison.",
    images: ["/laptop.jpg"],
  },
  verification: {
    other: {
      "feedico-site-verification": "e31414679f99150e3ac33a217ddfcd93e51ea4dd5f2eb2fc",
    },
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
        <head>
          <meta name="feedico-site-verification" content="e31414679f99150e3ac33a217ddfcd93e51ea4dd5f2eb2fc" />
        </head>
        <body 
          className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-indigo/20 selection:text-brand-indigo-600"
          suppressHydrationWarning
        >
          <GoogleAnalytics />
          <StructuredData />
          <GlobalClientTelemetry />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
