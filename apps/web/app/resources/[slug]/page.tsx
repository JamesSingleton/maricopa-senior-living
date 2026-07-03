import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import { buildMetadata } from "@maricopa-senior-living/sanity/metadata";
import {
  queryResourceBySlug,
  queryResourceSlugs,
  querySiteSettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import BackButton from "@/components/BackButton";
import BusinessHours from "@/components/BusinessHours";
import { CustomPortableText } from "@/components/CustomPortableText";
import ImageComponent from "@/components/ImageComponent";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { LinkButton } from "@/components/LinkButton";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryResourceSlugs });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }, { data: settings }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
    sanityFetchMetadata({ query: querySiteSettings, perspective: "published" }),
  ]);
  const { data: resource } = await sanityFetchMetadata({
    query: queryResourceBySlug,
    params: { slug },
    perspective,
  });
  if (!resource) return {};
  const r = resource as {
    title?: string;
    description?: string;
    seo?: Parameters<typeof buildMetadata>[0]["seo"];
  };
  return buildMetadata({
    seo: r.seo,
    fallbackTitle: r.title ?? "Resource",
    fallbackDescription: r.description,
    path: `/resources/${slug}`,
    siteTitle: (settings as { title?: string })?.title,
  });
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense fallback={<ResourceFallback />}>
        <DynamicResourcePage params={params} />
      </Suspense>
    );
  }
  const { slug } = await params;
  return <CachedResourcePage slug={slug} perspective="published" stega={false} />;
}

async function DynamicResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedResourcePage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedResourcePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryResourceBySlug,
    params: { slug },
    perspective,
    stega,
  });
  const resource = data as {
    title?: string;
    description?: string;
    body?: [];
    image?: Parameters<typeof ImageComponent>[0]["image"];
    contact?: {
      phone?: string;
      email?: string;
      website?: string;
      streetAddress?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    hours?: [];
    lastVerified?: string;
    category?: { title?: string; slug?: string };
    tags?: { _id: string; title: string; slug: string }[];
  } | null;
  if (!resource) notFound();

  const phoneDigits = resource.contact?.phone?.replace(/\D/g, "") ?? "";
  const address = [
    resource.contact?.streetAddress,
    resource.contact?.city,
    resource.contact?.state,
    resource.contact?.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          ...(resource.category?.title && resource.category.slug
            ? [
                {
                  name: resource.category.title,
                  path: `/category/${resource.category.slug}`,
                },
              ]
            : []),
          {
            name: resource.title ?? "Resource",
            path: `/resources/${slug}`,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: resource.title,
          telephone: resource.contact?.phone,
          address: address
            ? {
                "@type": "PostalAddress",
                streetAddress: resource.contact?.streetAddress,
                addressLocality: resource.contact?.city,
                addressRegion: resource.contact?.state,
                postalCode: resource.contact?.zip,
              }
            : undefined,
        }}
      />
      <BackButton />
      <article className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-6 py-8 sm:px-10">
          {resource.category?.title ? (
            <Link
              href={`/category/${resource.category.slug}`}
              className="text-sm font-medium text-primary hover:underline"
              prefetch={false}
            >
              {resource.category.title}
            </Link>
          ) : null}
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            {resource.title}
          </h1>
          {resource.description ? (
            <p className="mt-4 text-lg text-muted-foreground">
              {resource.description}
            </p>
          ) : null}
          {resource.contact?.phone ? (
            <div className="mt-6">
              <LinkButton
                href={`tel:${phoneDigits}`}
                size="lg"
                className="min-h-12 min-w-44 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Call {resource.contact.phone}
              </LinkButton>
            </div>
          ) : null}
          {resource.image ? (
            <div className="mt-6 overflow-hidden rounded-lg">
              <ImageComponent
                image={resource.image}
                alt={(resource.image as { alt?: string })?.alt ?? ""}
                width={1024}
                height={640}
                className="w-full"
              />
            </div>
          ) : null}
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {resource.contact?.email ? (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd>
                  <a
                    href={`mailto:${resource.contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {resource.contact.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {resource.contact?.website ? (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Website</dt>
                <dd>
                  <a
                    href={resource.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit website
                  </a>
                </dd>
              </div>
            ) : null}
            {address ? (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd>{address}</dd>
              </div>
            ) : null}
            {resource.lastVerified ? (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Last verified
                </dt>
                <dd>{resource.lastVerified}</dd>
              </div>
            ) : null}
          </dl>
          {resource.hours?.length ? (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold">Hours</h2>
              <BusinessHours hours={resource.hours} />
            </div>
          ) : null}
          <div className="prose prose-lg mt-8 max-w-none">
            <CustomPortableText value={resource.body ?? []} />
          </div>
          {resource.tags?.length ? (
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="text-lg font-semibold">Tags</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
                      prefetch={false}
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}

function ResourceFallback() {
  return <div className="h-96 animate-pulse rounded-xl bg-muted" aria-busy />;
}
