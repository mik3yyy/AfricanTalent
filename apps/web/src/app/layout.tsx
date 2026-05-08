import type { Metadata } from "next";
import { platformConfig } from "@platform/config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${platformConfig.name} — ${platformConfig.tagline}`,
    template: `%s | ${platformConfig.name}`,
  },
  description: platformConfig.description,
  keywords: [
    "African talent",
    "remote work",
    "global hiring",
    "talent marketplace",
    "African developers",
    "remote teams",
    "AfriTalent",
  ],
  authors: [{ name: platformConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${platformConfig.domain}`,
    siteName: platformConfig.name,
    title: `${platformConfig.name} — ${platformConfig.tagline}`,
    description: platformConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${platformConfig.name} — ${platformConfig.tagline}`,
    description: platformConfig.description,
  },
  metadataBase: new URL(`https://${platformConfig.domain}`),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
