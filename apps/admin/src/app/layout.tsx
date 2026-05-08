import type { Metadata } from "next";
import { platformConfig } from "@platform/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${platformConfig.shortName} Admin`,
  description: `Admin panel for ${platformConfig.name}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
