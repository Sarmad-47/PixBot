import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/nav/top-nav";
import { ClerkProvider } from "@clerk/nextjs";
import { ImageProvider } from "@/context/image";
import { ThemeProvider } from "@/context/theme";
import ToasterProvider from "@/context/toaster-provider";
import PaypalProvider from "@/context/paypal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixbot - AI Image Generator",
  description:
    "Generate images with AI for free, Buy credits to generate more images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ImageProvider>
              <PaypalProvider>
                <TopNav />
                {children}
              </PaypalProvider>
            </ImageProvider>
          </ThemeProvider>
          <ToasterProvider />
        </ClerkProvider>
      </body>
    </html>
  );
}
