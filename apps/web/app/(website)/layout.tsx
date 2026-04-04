import "@maricopa-senior-living/ui/globals.css";
import { SanityLive } from "@maricopa-senior-living/sanity/live";
import type { Metadata } from "next";
import Script from "next/script";
import PlausibleProvider from "next-plausible";

import ScrollToTop from "@/components/ScrollToTop";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { baseUrl } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | Maricopa Senior Living",
    default: "Maricopa Senior Living - Aging Well Your Way!",
  },
  openGraph: {
    type: "website",
    title: {
      template: "%s | Maricopa Senior Living",
      default: "Maricopa Senior Living - Aging Well Your Way!",
    },
  },
};

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlausibleProvider
      domain="maricopaseniorliving.org"
      trackFileDownloads
      trackOutboundLinks
    >
      <Script
        src="https://cdn.userway.org/widget.js"
        data-account="qeA6uoRyx5"
        data-position="2"
      />
      <SiteHeader />
      <main className="min-h-screen flex flex-col bg-background">
        {children}
      </main>
      <SiteFooter />
      <ScrollToTop />
      <SanityLive />
    </PlausibleProvider>
  );
}
