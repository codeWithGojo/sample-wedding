import type { Metadata } from "next";
import "./globals.css";

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
    images: [{ url: "/couple/forever.webp", width: 960, height: 1378, alt: "#BlessingFoundHerBlessing — Traditional Marriage, 12 December 2026, 11am prompt, Ughelli, Delta State" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "#BlessingFoundHerBlessing · 12 December 2026",
    description: "Traditional marriage · 11am prompt · Ughelli, Delta State. #BlessingFoundHerBlessing",
    images: ["/couple/forever.webp"],
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
