import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { DevelopmentProvider } from "@/context/DevelopmentContext"; // adjust path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Bank - Data Analytics",
  description: "Comprehensive global economic and development insights",
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
        <main className="flex flex-row w-screen h-screen">
          <Navbar />
          <DevelopmentProvider>
            <section className="h-full w-full bg-blue-50 flex-wrap">
              {children}
            </section>
          </DevelopmentProvider>
        </main>
      </body>
    </html >
  );
}
