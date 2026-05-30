import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Pete Pics — The Gallery | AGoodPete",
  description:
    "A permanent collection dedicated to the finest Pete-adjacent artwork, Pobots, Prestlers, and Cultural Artefacts of Our Time. Created by AGoodPete on Twitch.",
  keywords: ["Pete Pics", "AGoodPete", "Twitch", "Gallery", "Pobots", "Prestlers", "Art", "Collection"],
  authors: [{ name: "AGoodPete", url: "https://twitch.tv/AGoodPete" }],
  openGraph: {
    title: "Pete Pics — The Gallery",
    description: "The world's finest Pete-related artwork collection.",
    siteName: "Pete Pics",
    type: "website",
    images: [{ url: "/BigPeteOilPainting.webp", width: 1200, height: 630, alt: "Pete Pics — The Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pete Pics — The Gallery",
    description: "The world's finest Pete-related artwork collection.",
    images: ["/BigPeteOilPainting.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
