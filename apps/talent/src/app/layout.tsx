import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { platformConfig } from "@platform/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: platformConfig.name,
    template: `%s | ${platformConfig.shortName}`,
  },
  description: platformConfig.tagline,
  metadataBase: new URL(`https://${platformConfig.domain}`),
  openGraph: {
    title: platformConfig.name,
    description: platformConfig.tagline,
    siteName: platformConfig.shortName,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f1f5f9",
            },
          }}
        />
      </body>
    </html>
  );
}
