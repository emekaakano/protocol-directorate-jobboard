import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "JobBoard — Find Your Next Opportunity",
  description:
    "Browse verified job listings. Fresh opportunities updated daily, auto-archived after 30 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-jb-muted text-jb-text`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
