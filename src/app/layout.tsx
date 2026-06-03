import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Peet Pics — The Gallery | AGoodPeet",
  description:
    "A permanent collection dedicated to the finest Peet-adjacent artwork, Pobots, Prestlers, and Cultural Artefacts of Our Time. Created by AGoodPeet on Twitch.",
  keywords: ["Peet Pics", "AGoodPeet", "Twitch", "Gallery", "Pobots", "Prestlers", "Art", "Collection"],
  authors: [{ name: "AGoodPeet", url: "https://twitch.tv/AGoodPete" }],
  openGraph: {
    title: "Peet Pics — The Gallery",
    description: "The world's finest Peet-related artwork collection.",
    siteName: "Peet Pics",
    type: "website",
    images: [{ url: "/BigPeetOilPainting.webp", width: 1200, height: 630, alt: "Peet Pics — The Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peet Pics — The Gallery",
    description: "The world's finest Peet-related artwork collection.",
    images: ["/BigPeetOilPainting.webp"],
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
