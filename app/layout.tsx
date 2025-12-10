import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Reddit Music Player - Stream Music from Reddit",
    template: "%s | Reddit Music Player",
  },
  description: "Stream music from Reddit communities. Listen to YouTube tracks curated by music subreddits like r/listentothis, r/music, and more.",
  keywords: ["reddit", "music", "player", "streaming", "youtube", "listentothis"],
  authors: [{ name: "Skandesh" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Reddit Music Player",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
