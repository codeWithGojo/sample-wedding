import type { Metadata } from "next";
import "./globals.css";
import "./entrance.css";
import "./keepsakes.css";
import "./refinement.css";
import WeddingMusic from "./wedding-music";
import { entrancePhoto } from './love-story';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: "#BlessingFoundHerBlessing | Traditional Marriage · 12 December 2026",
  metadataBase: new URL(siteOrigin),
  description: "The Awhefeada and Toka families invite you to the #BlessingFoundHerBlessing traditional marriage. 12 December 2026, 11am prompt, Ughelli, Delta State.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "#BlessingFoundHerBlessing",
    title: "#BlessingFoundHerBlessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ricky’s Hotel and Event Place, Ughelli, Delta State. #BlessingFoundHerBlessing",
    images: [{ url: entrancePhoto, width: 1025, height: 1534, alt: "Blessing Egokiniovo and Blessing Oshevire — Traditional Marriage, 12 December 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "#BlessingFoundHerBlessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ughelli, Delta State. #BlessingFoundHerBlessing",
    images: [entrancePhoto],
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.svg?v=bb1", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico?v=bb1", sizes: "16x16 32x32 48x48 64x64" },
    ],
    shortcut: "/favicon.ico?v=bb1",
    apple: { url: "/apple-touch-icon.png?v=bb1", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}<WeddingMusic/></body>
    </html>
  );
}
