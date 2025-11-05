import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";
import ToastHandler from "@/components/toast-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "posteer",
  description: "steer your profile's socials in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Full-screen gradient background */}
          <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/30 to-muted/60 -z-10" />
          <Navbar />
          {children}
          <Toaster />
          <ToastHandler />
        </ThemeProvider>
      </body>
    </html>
  );
}
