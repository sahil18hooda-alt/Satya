import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SatyaHeader } from "@/components/SatyaHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S.A.T.Y.A. (सत्य) | Authentic Tracking & Youth Awareness",
  description: "Official Platform for Election Integrity and Democratic Awareness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SatyaHeader />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
