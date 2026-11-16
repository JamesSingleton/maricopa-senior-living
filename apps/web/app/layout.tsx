import "@maricopa-senior-living/ui/globals.css";
import "./site.css";

import {
  cachedSanityMetadata,
  SanityLive,
} from "@maricopa-senior-living/sanity/live";
import { querySettings } from "@maricopa-senior-living/sanity/queries";
import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Source_Serif_4 } from "next/font/google";
import { draftMode } from "next/headers";
import PlausibleProvider from "next-plausible";
import { VisualEditing } from "next-sanity/visual-editing";

import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { baseUrl } from "@/lib/constants";
import { draftAware } from "@/lib/draft";
import { imageUrl } from "@/lib/structured-data";

// Atkinson Hyperlegible was drawn by the Braille Institute for low-vision
// readers (unmistakable I/l/1, open counters); Source Serif gives headings
// a steady, newspaper-like voice.
const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Site defaults; pages override title, description and share picture. */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await cachedSanityMetadata({
    query: querySettings,
    perspective: "published",
  });
  const shareImage = imageUrl(
    settings?.shareImageId ?? settings?.heroImage?.id,
    1200,
  );
  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: "%s | Maricopa Senior Living",
      default: "Maricopa Senior Living — resources to help you age your way",
    },
    description:
      settings?.description ??
      "Local resources, events and news for seniors and caregivers in Maricopa, Arizona.",
    openGraph: {
      type: "website",
      siteName: settings?.siteTitle ?? "Maricopa Senior Living",
      locale: "en_US",
      ...(shareImage ? { images: [{ url: shareImage, width: 1200 }] } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#17302a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
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
