import "@maricopa-senior-living/ui/globals.css";
import "@/app/globals.css";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  SanityLive,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import {
  queryMainNavigation,
  querySiteFooter,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { draftMode } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Script from "next/script";
import PlausibleProvider from "next-plausible";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import {
  CachedRightSidebar,
  DynamicRightSidebar,
  RightSidebarFallback,
} from "@/components/RightSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { baseUrl } from "@/lib/constants";

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

async function fetchLayoutData({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [nav, footer, settings] = await Promise.all([
    sanityFetch({ query: queryMainNavigation, perspective, stega }),
    sanityFetch({ query: querySiteFooter, perspective, stega }),
    sanityFetch({ query: querySiteSettings, perspective, stega }),
  ]);
  return {
    nav: nav.data,
    footer: footer.data,
    settings: settings.data,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetchMetadata({
    query: querySiteSettings,
    perspective: "published",
  });
  const siteTitle =
    (settings as { title?: string })?.title ?? "Maricopa Senior Resource Hub";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${siteTitle}`,
      default: siteTitle,
    },
    description:
      (settings as { description?: string })?.description ??
      "Local resources, guides, and news for seniors in Maricopa, Arizona.",
    openGraph: {
      type: "website",
      siteName: siteTitle,
    },
  };
}

async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHeader perspective={perspective} stega={stega} />;
}

async function CachedHeader({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { nav, settings } = await fetchLayoutData({ perspective, stega });
  const siteTitle = (settings as { title?: string })?.title;
  return (
    <Header
      menu={(nav as { items?: [] })?.items ?? []}
      siteTitle={siteTitle ?? undefined}
    />
  );
}

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedFooter perspective={perspective} stega={stega} />;
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { footer, settings } = await fetchLayoutData({ perspective, stega });
  const footerData = footer as {
    columns?: [];
    tagline?: string;
    copyright?: string;
  } | null;
  const siteTitle = (settings as { title?: string })?.title;
  return (
    <Footer
      columns={footerData?.columns ?? []}
      tagline={footerData?.tagline}
      copyright={footerData?.copyright}
      siteTitle={siteTitle ?? undefined}
    />
  );
}

function HeaderFallback() {
  return <div className="h-16 animate-pulse border-b bg-muted" aria-busy />;
}

function FooterFallback() {
  return <div className="h-32 animate-pulse bg-muted" aria-busy />;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSerif.variable} ${fontSans.variable} font-sans antialiased`}
      >
        <NuqsAdapter>
          <PlausibleProvider src="https://plausible.io/js/pa-_c-PnIRRG3vdbjzqvT4GH.js">
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Maricopa Senior Resource Hub",
                url: baseUrl,
              }}
            />
            <Script
              src="https://cdn.userway.org/widget.js"
              data-account="qeA6uoRyx5"
              data-position="2"
            />
            <Suspense fallback={<HeaderFallback />}>
              {isDraftMode ? (
                <DynamicHeader />
              ) : (
                <CachedHeader perspective="published" stega={false} />
              )}
            </Suspense>
            <main className="py-8 md:py-10 lg:py-12">
              <div className="container grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8">{children}</div>
                <aside className="col-span-12 space-y-8 lg:col-span-4">
                  <Suspense fallback={<RightSidebarFallback />}>
                    {isDraftMode ? (
                      <DynamicRightSidebar />
                    ) : (
                      <CachedRightSidebar perspective="published" stega={false} />
                    )}
                  </Suspense>
                </aside>
              </div>
            </main>
            <Suspense fallback={<FooterFallback />}>
              {isDraftMode ? (
                <DynamicFooter />
              ) : (
                <CachedFooter perspective="published" stega={false} />
              )}
            </Suspense>
            <ScrollToTop />
            <SanityLive includeDrafts={isDraftMode} />
            {isDraftMode && <VisualEditing />}
          </PlausibleProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
