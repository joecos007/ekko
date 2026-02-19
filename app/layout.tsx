import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { AudioProvider } from "@/components/player/audio-provider";
import { PlayerBar } from "@/components/player/player-bar";
import { SkipNav } from "@/components/layout/skip-nav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "EKKO — AI-Powered Music Streaming",
    template: "%s | EKKO",
  },
  description: "Create, stream, and share music powered by AI. Turn your stories into songs with EKKO's intelligent music platform.",
  keywords: ["music streaming", "AI music", "create music", "audio streaming", "EKKO", "music platform"],
  authors: [{ name: "EKKO Team" }],
  icons: {
    icon: "/ekko-icon.svg",
    shortcut: "/ekko-icon.svg",
    apple: "/ekko-icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "EKKO",
    title: "EKKO — AI-Powered Music Streaming",
    description: "Create, stream, and share music powered by AI. Turn your stories into songs with EKKO's intelligent music platform.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EKKO — AI-Powered Music Streaming",
    description: "Create, stream, and share music powered by AI.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <SkipNav />
          <div id="main-content">
            {children}
          </div>
          <AudioProvider />
          <PlayerBar />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
