import "@maricopa-senior-living/ui/globals.css";
import "./site.css";

import { SanityLive } from "@maricopa-senior-living/sanity/live";
import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { draftMode } from "next/headers";
import PlausibleProvider from "next-plausible";
import { VisualEditing } from "next-sanity/visual-editing";

import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { baseUrl } from "@/lib/constants";
import { draftAware } from "@/lib/draft";

// Onest: open, high x-height sans with metrics Next knows (no fallback
// warning), used for headings and text alike.
const sans = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | Maricopa Senior Living",
    default: "Maricopa Senior Living — resources to help you age your way",
  },
  description:
    "Local resources, events and news for seniors and caregivers in Maricopa, Arizona.",
  openGraph: {
    type: "website",
    siteName: "Maricopa Senior Living",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e2a23",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="en" className={sans.variable}>
      <body className="flex min-h-dvh flex-col">
        <PlausibleProvider src="https://plausible.io/js/pa-_c-PnIRRG3vdbjzqvT4GH.js">
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          {/*
            UserWay accessibility widget — commented out for the rebuild,
            which is built to WCAG 2.2 AA directly. Ron asked for it at some
            point; restore if he still wants it.
            <Script src="https://cdn.userway.org/widget.js" data-account="qeA6uoRyx5" data-position="2" />
          */}
          {await draftAware((options) => <SiteHeader {...options} />)}
          <main id="main" className="flex-1">
            {children}
          </main>
          {await draftAware((options) => <SiteFooter {...options} />)}
          <SanityLive
            includeDrafts={isDraftMode}
            waitFor={
              process.env.VERCEL_ENV === "production" ? "function" : undefined
            }
          />
          {isDraftMode ? (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          ) : null}
        </PlausibleProvider>
      </body>
    </html>
  );
}
