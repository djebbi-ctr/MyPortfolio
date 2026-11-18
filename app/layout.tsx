import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, JetBrains_Mono, Mona_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/asset";

const mona = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-mona", display: "swap" });
const plexAr = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: "500", variable: "--font-plex-ar", display: "swap", preload: false });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: profile.siteTitle,
  description: profile.siteDescription,
  openGraph: { title: profile.siteTitle, description: profile.siteDescription, type: "website", locale: "en" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#05070B", colorScheme: "dark", viewportFit: "cover" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.arabic,
  jobTitle: "Enterprise data engineer",
  address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
  email: `mailto:${profile.links.email}`,
  worksFor: { "@type": "Organization", name: "Devoteam" },
  sameAs: [profile.links.linkedin, profile.links.github].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${mona.variable} ${plexAr.variable} ${code.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
