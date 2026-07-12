import "@/app/globals.css";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  SanityLive,
  sanityFetch,
} from "@maricopa-senior-living/sanity/live";
import {
  queryGlobalSeoSettings,
  queryNavigation,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Script from "next/script";
import PlausibleProvider from "next-plausible";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";

import { DisableDraftMode } from "@/components/DisableDraftMode";
import Footer from "@/components/Footer";
import {
  CachedRightSidebar,
  DynamicRightSidebar,
  RightSidebarFallback,
} from "@/components/RightSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { SiteHeader } from "@/components/site-header";
import { baseUrl } from "@/lib/constants";
import { type HeaderNavItem, resolveHeaderNavItems } from "@/lib/header-nav";

type SiteSettingsData = {
  siteTitle?: string | null;
} | null;

type NavigationData = {
  headerPrimary?: HeaderNavItem[];
  footer?: any[];
} | null;

async function fetchSiteSettings({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryGlobalSeoSettings,
    perspective,
    stega,
  });
  return data as SiteSettingsData;
}

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

async function fetchNavigation({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryNavigation,
    perspective,
    stega,
  });
  return data as NavigationData;
}

async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHeader perspective={perspective} stega={stega} />;
}

async function CachedHeader({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [navigation, settingsData] = await Promise.all([
    fetchNavigation({ perspective, stega }),
    fetchSiteSettings({ perspective, stega }),
  ]);
  const navItems = resolveHeaderNavItems(navigation?.headerPrimary);

  return <SiteHeader navItems={navItems} siteTitle={settingsData?.siteTitle} />;
}

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedFooter perspective={perspective} stega={stega} />;
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const navigation = await fetchNavigation({ perspective, stega });
  return <Footer menu={navigation?.footer ?? []} />;
}

function HeaderFallback() {
  return <div className="h-20 animate-pulse bg-zinc-100" aria-busy />;
}

function FooterFallback() {
  return <div className="h-32 animate-pulse bg-zinc-100" aria-busy />;
}

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <PlausibleProvider src="https://plausible.io/js/pa-_c-PnIRRG3vdbjzqvT4GH.js">
      <Script
        src="https://cdn.userway.org/widget.js"
        data-account="qeA6uoRyx5"
        data-position="2"
      />
      {isDraftMode ? (
        <Suspense fallback={<HeaderFallback />}>
          <DynamicHeader />
        </Suspense>
      ) : (
        <CachedHeader perspective="published" stega={false} />
      )}
      <main className="py-8 md:py-10 lg:py-14 xl:py-16">
        <div className="container grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">{children}</div>
          <div className="col-span-12 space-y-8 lg:col-span-4">
            {isDraftMode ? (
              <Suspense fallback={<RightSidebarFallback />}>
                <DynamicRightSidebar />
              </Suspense>
            ) : (
              <CachedRightSidebar perspective="published" stega={false} />
            )}
          </div>
        </div>
      </main>
      {isDraftMode ? (
        <Suspense fallback={<FooterFallback />}>
          <DynamicFooter />
        </Suspense>
      ) : (
        <CachedFooter perspective="published" stega={false} />
      )}
      <ScrollToTop />
      <SanityLive
        includeDrafts={isDraftMode}
        waitFor={
          process.env.VERCEL_ENV === "production" ? "function" : undefined
        }
      />
      {isDraftMode && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </PlausibleProvider>
  );
}
