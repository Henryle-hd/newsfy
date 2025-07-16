import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NewsNavbar from "@/components/NavBar";
import NewsfyFooter from "@/components/Footer";
import AuthProvider from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newsfy - Your Source for Latest News",
  description: "Stay informed with Newsfy - your trusted source for breaking news, articles and updates across HABARI, AFYA, TEHAMA, AJIRA, BURUDANI, and MICHEZO categories. Get real-time news coverage, expert analysis, and in-depth reporting.",
  keywords: "news, breaking news, latest news, international news, health news, technology news, jobs, entertainment, sports news, Tanzania news",
  authors: [{ name: "Amina Hassan" },{ name: "Munira Zubery" }],
  creator: "Newsfy",
  publisher: "Newsfy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "news",
  openGraph: {
    title: "Newsfy - Breaking News & Updates",
    description: "Your trusted source for latest news and updates across multiple categories",
    type: "website",
    locale: "sw",
    siteName: "Newsfy",
    images: ['/logo.jpg'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsfy - Breaking News & Updates",
    description: "Your trusted source for latest news and updates across multiple categories",
    creator: "@newsfy",
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://newsfy-nine.vercel.app/",
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
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
        <AuthProvider>
        <main className="bg-gray-100">
        <NewsNavbar />
        {children}
        <NewsfyFooter />
        </main>
        <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,700,900&display=swap"
        rel="stylesheet"
      />
      </AuthProvider>
      </body>
    </html>
  );
}
