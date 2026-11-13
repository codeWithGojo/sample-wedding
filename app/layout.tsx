import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import "./entrance.css";
import "./keepsakes.css";
import "./refinement.css";
import "./celebration.css";
import "./stationery.css";
import "./button-motion.css";
import "./curtains.css";
import "./scene.css";
import WeddingMusic from "./wedding-music";
import { weddingConfig } from './wedding-config';
import { weddingSiteUrl } from './calendar';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || weddingSiteUrl;
const displayFont = localFont({src:'../public/fonts/cormorant-garamond.woff2',variable:'--font-wedding-display',weight:'400 600',display:'swap'});
const textFont = localFont({src:'../public/fonts/manrope.woff2',variable:'--font-wedding-text',weight:'400 600',display:'swap'});

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
    images: [{ url: "/wedding-share-2026.jpg", width: 1200, height: 630, type: "image/jpeg", alt: `${weddingConfig.names.together} — ${weddingConfig.date.short}, 11am, Ughelli` }],
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
      <body className={`${displayFont.variable} ${textFont.variable} antialiased`}>{children}<WeddingMusic/>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 80 100"
        style={{
          position: "fixed",
          insetInlineEnd: "max(4px, env(safe-area-inset-right))",
          insetBlockEnd: "max(0px, env(safe-area-inset-bottom))",
          width: "clamp(42px, 7vw, 68px)",
          height: "auto",
          zIndex: 2,
          pointerEvents: "none",
          stroke: "none",
          filter: "drop-shadow(0 2px 4px #210d1370)",
        }}
      >
        <path fill="#88543d" d="M35 81h10v17H35z" />
        <path fill="#214d3b" d="M40 27 8 87q32 10 64 0L40 27Z" />
        <path fill="#30674e" d="M40 18 14 68q26 9 52 0L40 18Z" />
        <path fill="#428167" d="M40 13 22 48q18 7 36 0L40 13Z" />
        <path fill="none" stroke="#f6d695" strokeWidth="2" strokeLinecap="round" d="M30 43q8 5 18 2M24 63q15 8 32 3M17 83q21 9 46 2" />
        <g fill="#f4a7ae">
          <circle cx="34" cy="54" r="2.8" /><circle cx="53" cy="59" r="2.8" />
          <circle cx="26" cy="75" r="2.8" /><circle cx="48" cy="79" r="2.8" />
        </g>
        <path fill="#f8d486" d="m40 1 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" />
      </svg>
</body>
    </html>
  );
}
