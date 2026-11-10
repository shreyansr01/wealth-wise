import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-plus-jakarta-sans' });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair-display' });
const notoSansBengali = Noto_Sans_Bengali({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"], 
  variable: '--font-noto-bengali',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wealth-wise.vercel.app"),
  title: {
    default: "WealthWise — Financial Advisory | Monotosh Sardar",
    template: "%s | WealthWise",
  },
  description: "Clear financial planning, insurance advisory, mutual fund investments, and document services with 19+ years of experience in Kolkata & West Bengal.",
  keywords: [
    "Financial Advisor Kolkata",
    "Monotosh Sardar",
    "WealthWise",
    "Mutual Funds SIP",
    "Health Insurance Kolkata",
    "Life Insurance LIC",
    "ITR Filing Kolkata",
    "Financial Planner West Bengal",
  ],
  authors: [{ name: "Monotosh Sardar" }],
  creator: "Monotosh Sardar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wealth-wise.vercel.app",
    siteName: "WealthWise Financial Advisory",
    title: "WealthWise — Financial Advisory | Monotosh Sardar",
    description: "Clear financial planning, insurance advisory, mutual fund investments, and document services with 19+ years of experience in Kolkata.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "WealthWise Financial Advisory Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "WealthWise — Financial Advisory | Monotosh Sardar",
    description: "Clear financial planning, insurance advisory, and mutual fund investments with 19+ years of experience in Kolkata.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${notoSansBengali.variable}`}>
        {children}
      </body>
    </html>
  );
}