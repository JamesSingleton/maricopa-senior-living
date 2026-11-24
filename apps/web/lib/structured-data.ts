/**
 * schema.org JSON-LD for search engines and AI answer engines. Every builder
 * takes the data the page already loaded, so there are no extra queries.
 */
import { type Address, addressLines } from "./address";
import { baseUrl } from "./constants";

type Json = Record<string, unknown>;

export const ORG_ID = `${baseUrl}/#organization`;
export const SITE_ID = `${baseUrl}/#website`;

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;

/** Public CDN URL for an image asset id ("image-<hash>-1200x800-jpg"). */
export function imageUrl(assetId?: string | null, width = 1200) {
  const match = assetId?.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match || !PROJECT || !DATASET) return undefined;
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${match[1]}-${match[2]}.${match[3]}?w=${width}&auto=format`;
}

export function postalAddress(address: Address): Json | undefined {
  if (!address?.street && !address?.city) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: address.street ?? undefined,
    addressLocality: address.city ?? undefined,
    addressRegion: address.state ?? undefined,
    postalCode: address.zip ?? undefined,
    addressCountry: "US",
  };
}

/** Removes undefined/empty values so the JSON stays tidy. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map(clean)
      .filter((v) => v !== undefined && !(Array.isArray(v) && !v.length)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, clean(v)])
        .filter(
          ([, v]) =>
            v !== undefined &&
            v !== null &&
            v !== "" &&
            !(Array.isArray(v) && !v.length),
        ),
    ) as T;
  }
  return value;
}

export type SettingsForLd = {
  siteTitle?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: { number?: string | null } | null;
  mailingAddress?: Address;
  donateUrl?: string | null;
  profiles?: string[] | null;
  ein?: string | null;
  logoId?: string | null;
  mission?: string | null;
  foundedYear?: number | null;
  charityProfileUrl?: string | null;
} | null;

/** The nonprofit itself, plus the website with its search box. */
export function siteGraph(settings: SettingsForLd) {
  const name = settings?.siteTitle ?? "Maricopa Senior Living";
  return clean({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": ORG_ID,
        name,
        url: baseUrl,
        description: settings?.mission ?? settings?.description ?? undefined,
        foundingDate: settings?.foundedYear
          ? String(settings.foundedYear)
          : undefined,
        logo: imageUrl(settings?.logoId, 512),
        email: settings?.contactEmail ?? undefined,
        telephone: settings?.contactPhone?.number ?? undefined,
        address: postalAddress(settings?.mailingAddress ?? null),
        areaServed: { "@type": "City", name: "Maricopa, Arizona" },
        nonprofitStatus: "Nonprofit501c3",
        taxID: settings?.ein ?? undefined,
        sameAs: [
          ...(settings?.profiles ?? []),
          ...(settings?.charityProfileUrl ? [settings.charityProfileUrl] : []),
        ],
        potentialAction: settings?.donateUrl
          ? {
              "@type": "DonateAction",
              target: settings.donateUrl,
              recipient: { "@id": ORG_ID },
            }
          : undefined,
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: baseUrl,
        name,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  });
}

export function breadcrumbs(crumbs: { label: string; href: string }[]) {
  return clean({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Home", href: "/" }, ...crumbs].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: `${baseUrl}${crumb.href}`,
      }),
    ),
  });
}

const DAYS: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

const AREA: Record<string, Json> = {
  maricopa: { "@type": "City", name: "Maricopa, Arizona" },
  pinal: { "@type": "AdministrativeArea", name: "Pinal County, Arizona" },
  arizona: { "@type": "State", name: "Arizona" },
  national: { "@type": "Country", name: "United States" },
};

export function resourceLd(resource: {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  website?: string | null;
  email?: string | null;
  isGovernment?: boolean | null;
  serviceArea?: string | null;
  phones?: { number?: string | null; label?: string | null }[] | null;
  address?: Address;
  hours?:
    | { day?: string | null; opens?: string | null; closes?: string | null }[]
    | null;
  _updatedAt?: string | null;
}) {
  const phones = (resource.phones ?? []).filter(
    (p) => p.number && !/\bfax\b/i.test(p.label ?? ""),
  );
  return clean({
    "@context": "https://schema.org",
    // A government office or a local organization people can contact.
    "@type": resource.isGovernment ? "GovernmentOffice" : "LocalBusiness",
    "@id": `${baseUrl}/resources/${resource.slug}#organization`,
    name: resource.title ?? undefined,
    description: resource.summary ?? undefined,
    url: resource.website ?? `${baseUrl}/resources/${resource.slug}`,
    telephone: phones[0]?.number ?? undefined,
    email: resource.email ?? undefined,
    address: postalAddress(resource.address ?? null),
    areaServed: resource.serviceArea ? AREA[resource.serviceArea] : undefined,
    openingHoursSpecification: (resource.hours ?? [])
      .filter((h) => h.day && h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS[h.day as string],
        opens: h.opens,
        closes: h.closes,
      })),
    contactPoint: phones.slice(1).map((p) => ({
      "@type": "ContactPoint",
      telephone: p.number,
      contactType: p.label ?? "customer service",
    })),
    subjectOf: {
      "@type": "WebPage",
      url: `${baseUrl}/resources/${resource.slug}`,
      dateModified: resource._updatedAt ?? undefined,
    },
  });
}

const EVENT_STATUS: Record<string, string> = {
  scheduled: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed",
  movedOnline: "https://schema.org/EventMovedOnline",
  rescheduled: "https://schema.org/EventRescheduled",
};

const ATTENDANCE: Record<string, string> = {
  inPerson: "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  mixed: "https://schema.org/MixedEventAttendanceMode",
};

export function eventLd(event: {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  at: string;
  until?: string | null;
  status?: string | null;
  attendance?: string | null;
  onlineUrl?: string | null;
  location?: string | null;
  address?: Address;
  isFree?: boolean | null;
  cost?: string | null;
  hostedByMsl?: boolean | null;
  flyerId?: string | null;
}) {
  const attendance =
    event.status === "movedOnline"
      ? "online"
      : (event.attendance ?? "inPerson");
  const place = {
    "@type": "Place",
    name: event.location ?? undefined,
    address:
      postalAddress(event.address ?? null) ?? event.location ?? undefined,
  };
  const virtual = event.onlineUrl
    ? { "@type": "VirtualLocation", url: event.onlineUrl }
    : undefined;
  return clean({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title ?? undefined,
    description: event.summary ?? undefined,
    url: `${baseUrl}/events/${event.slug}`,
    startDate: event.at,
    endDate: event.until ?? undefined,
    eventStatus: EVENT_STATUS[event.status ?? "scheduled"],
    eventAttendanceMode: ATTENDANCE[attendance],
    location:
      attendance === "online"
        ? virtual
        : attendance === "mixed"
          ? [place, virtual]
          : place,
    image: imageUrl(event.flyerId),
    isAccessibleForFree: event.isFree !== false,
    organizer: event.hostedByMsl ? { "@id": ORG_ID } : undefined,
  });
}

export function articleLd(article: {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  publishedAt?: string | null;
  reviewedAt?: string | null;
  _updatedAt?: string | null;
  mainImageId?: string | null;
  author?: {
    name?: string | null;
    slug?: string | null;
    role?: string | null;
    credentials?: string | null;
    profiles?: string[] | null;
  } | null;
}) {
  const url = `${baseUrl}/articles/${article.slug}`;
  return clean({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title ?? undefined,
        description: article.summary ?? undefined,
        url,
        mainEntityOfPage: url,
        datePublished: article.publishedAt ?? undefined,
        dateModified: article._updatedAt ?? undefined,
        image: imageUrl(article.mainImageId),
        inLanguage: "en-US",
        publisher: { "@id": ORG_ID },
        author: article.author?.name
          ? {
              "@type": "Person",
              name: article.author.name,
              url: article.author.slug
                ? `${baseUrl}/writers/${article.author.slug}`
                : undefined,
              jobTitle: article.author.role ?? undefined,
              hasCredential: article.author.credentials
                ? {
                    "@type": "EducationalOccupationalCredential",
                    name: article.author.credentials,
                  }
                : undefined,
              sameAs: article.author.profiles ?? undefined,
            }
          : { "@id": ORG_ID },
      },
      // "Last checked" signals the content was reviewed for accuracy.
      article.reviewedAt
        ? {
            "@type": "WebPage",
            "@id": url,
            url,
            lastReviewed: article.reviewedAt,
          }
        : undefined,
    ],
  });
}

export function faqLd(
  items: { question?: string | null; answer?: string | null }[],
) {
  const valid = items.filter((i) => i.question && i.answer);
  if (!valid.length) return null;
  return clean({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}

/** A topic page: a curated list of local resources. */
export function topicLd(topic: {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  resources: { title?: string | null; slug?: string | null }[];
}) {
  return clean({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.title ?? undefined,
    description: topic.description ?? undefined,
    url: `${baseUrl}/topics/${topic.slug}`,
    isPartOf: { "@id": SITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: topic.resources.map((r, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: r.title,
        url: `${baseUrl}/resources/${r.slug}`,
      })),
    },
  });
}

export { addressLines };
