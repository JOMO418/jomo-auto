import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";
import { getAllProducts } from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOMO AUTO WORLD - Quality Ex-Japan Toyota Parts",
  description:
    "Your trusted source for genuine ex-Japan Toyota auto parts in Kenya. Specializing in Corolla, Fielder, Hiace, Prado, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch once at the layout level — available to search across all pages
  const products = await getAllProducts();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${playfair.variable} ${cinzel.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <RootLayoutClient products={products}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
