import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NewsNavbar from "@/components/NavBar";
import NewsfyFooter from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newsfy",
  description: "Quick update news around the word",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <main className="bg-gray-100">
        <NewsNavbar />
        {children}
        <NewsfyFooter />
        </main>
        <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,700,900&display=swap"
        rel="stylesheet"
      />
      </body>
    </html>
  );
}
