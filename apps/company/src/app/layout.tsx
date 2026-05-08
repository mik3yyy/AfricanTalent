import type { Metadata } from "next";
import { Toaster } from "sonner";
import { platformConfig } from "@platform/config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${platformConfig.name} — For Companies`,
    template: `%s | ${platformConfig.shortName} for Companies`,
  },
  description: `Find and hire ${platformConfig.tagline}. Search vetted African professionals for your global team.`,
  metadataBase: new URL(`https://${platformConfig.domain}`),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
