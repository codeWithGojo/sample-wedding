import type { Metadata } from "next";
import "./globals.css";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: "Blessing & Blessing | Traditional Marriage · 12 December 2026",
  metadataBase: new URL(siteOrigin),
  description: "The Awhefeada and Toka families invite you to Blessing and Blessing’s traditional marriage. 12 December 2026, 11am prompt, Ughelli, Delta State.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Blessing & Blessing",
    title: "Blessing & Blessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ricky’s Hotel and Event Place, Ughelli, Delta State. #BlessingFoundHerBlessing26",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "Blessing & Blessing — Traditional Marriage, 12 December 2026, 11am prompt, Ughelli, Delta State" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blessing & Blessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ughelli, Delta State. #BlessingFoundHerBlessing26",
    images: ["/og.png"],
  },
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
