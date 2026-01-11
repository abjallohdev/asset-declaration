import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Asset Declaration System",
  description: "Asset Declaration System Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-gray-50/50`}
      >
        <Providers>
          {children}
          <Toaster position='top-center' />
        </Providers>
      </body>
    </html>
  );
}
