import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Pete Pics — The Gallery",
    description: "The world's finest Pete-related artwork collection.",
  },
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
