import "@/app/globals.css";
import { SanityLive } from "@maricopa-senior-living/sanity/live";
import type { Metadata } from "next";
import Script from "next/script";
import PlausibleProvider from "next-plausible";
import { Suspense } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { baseUrl } from "@/lib/constants";
import { getNavigation } from "@/lib/sanity.fetch";

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
  const navigation = await getNavigation();

  return (
    <PlausibleProvider src="https://plausible.io/js/pa-_c-PnIRRG3vdbjzqvT4GH.js">
      <Script
        src="https://cdn.userway.org/widget.js"
        data-account="qeA6uoRyx5"
        data-position="2"
      />
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-zinc-900" />
          </div>
        }
      >
        <Header menu={navigation.headerPrimary} />
      </Suspense>
      <main className="py-8 md:py-10 lg:py-14 xl:py-16">
        <div className="container grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">{children}</div>
          <div className="col-span-12 space-y-8 lg:col-span-4">
            <RightSidebar />
          </div>
        </div>
      </main>
      <Footer menu={navigation.footer} />
      <ScrollToTop />
      <SanityLive />
    </PlausibleProvider>
  );
}
