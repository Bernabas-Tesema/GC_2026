import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const Providers = dynamic(() => import("@/components/Providers"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-paper-warm">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"
        aria-hidden
      />
    </div>
  ),
});

export const metadata: Metadata = {
  title: "GC ቤንሃናን | Christian Fellowship Yearbook",
  description:
    "Digital yearbook for the 2026 graduating class of Arba Minch University Christian Fellowship",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
