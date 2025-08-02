import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/context/LayoutContext";
import { Toaster } from "sonner";
import { DataProvider } from "@/context/DataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kindly Hub | Admin dashboard",
  description: "Kindly connects donors with impactful causes. Donate securely and help empower communities worldwide through your generosity.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png'
  }
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
        <LayoutProvider>
          <DataProvider>
            {children}
          </DataProvider>
          <Toaster richColors position="top-center"/>
        </LayoutProvider>
      </body>
    </html>
  );
}
