import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./entrance.css";
import "./keepsakes.css";
import "./refinement.css";
import "./celebration.css";
import WeddingMusic from "./wedding-music";
import { weddingSiteUrl } from './calendar';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || weddingSiteUrl;

export const viewport: Viewport = {themeColor:'#650912'};

export const metadata: Metadata = {
  title: "#BlessingFoundHerBlessing | Traditional Marriage · 12 December 2026",
  metadataBase: new URL(siteOrigin),
  description: "The Awhefeada and Toka families invite you to the #BlessingFoundHerBlessing traditional marriage. 12 December 2026, 11am prompt, Ughelli, Delta State.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "#BlessingFoundHerBlessing",
    url: "/",
    title: "#BlessingFoundHerBlessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ricky’s Hotel and Event Place, Ughelli, Delta State. #BlessingFoundHerBlessing",
    images: [{ url: "/wedding-share-2026.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Blessing Egokiniovo and Blessing Oshevire — 12 December 2026, 11am, Ughelli" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "#BlessingFoundHerBlessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ughelli, Delta State. #BlessingFoundHerBlessing",
    images: ["/wedding-share-2026.jpg"],
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon-192.png?v=portrait-2026", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico?v=portrait-2026", sizes: "16x16 32x32 48x48 64x64" },
    ],
    shortcut: "/favicon.ico?v=portrait-2026",
    apple: { url: "/apple-touch-icon.png?v=portrait-2026", sizes: "180x180", type: "image/png" },
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
