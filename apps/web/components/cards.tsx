import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { formatLongDate, SITE_TIME_ZONE } from "@/lib/dates";
import { type Occurrence, timeRange } from "@/lib/events";
import { hostOf, telHref } from "@/lib/links";
import { SanityImage, type SanityImageData } from "./sanity-image";

type Phone = { _key?: string; label?: string | null; number?: string | null };

const isFax = (phone: Phone) => /\bfax\b/i.test(phone.label ?? "");

/**
 * Green "Call" buttons, one per number. Labels ("Casa Grande office",
 * "Toll free") only show with `showLabels`, as a heading above the button,
 * so they never read like a caption of the wrong thing. Fax numbers are
 * shown as text, never as a Call button.
 */
export function CallButtons({
  phones,
  max = 3,
  showLabels = false,
}: {
  phones?: Phone[] | null;
  max?: number;
  showLabels?: boolean;
}) {
  const all = (phones ?? []).filter((p) => p.number);
  const callable = all.filter((p) => !isFax(p)).slice(0, max);
  const faxes = showLabels ? all.filter(isFax) : [];
  if (!callable.length && !faxes.length) return null;
  return (
    <div className="flex flex-col gap-4">
      <ul
        className={showLabels ? "flex flex-col gap-4" : "flex flex-wrap gap-3"}
      >
        {callable.map((phone) => (
          <li key={phone._key ?? phone.number}>
            {showLabels && phone.label ? (
              <p className="mb-1.5 font-semibold">{phone.label}</p>
            ) : null}
            <a href={telHref(phone.number as string)} className="btn btn-call">
              <Phone className="size-5" aria-hidden="true" />
              <span>
                Call {phone.number}
                {phone.label ? (
                  <span className="sr-only"> ({phone.label})</span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {faxes.map((fax) => (
        <p key={fax._key ?? fax.number} className="muted">
          Fax: {fax.number}
        </p>
      ))}
    </div>
  );
}

const AREA_LABEL: Record<string, string> = {
  maricopa: "City of Maricopa",
  pinal: "Pinal County",
  arizona: "Arizona",
  national: "Anywhere (national)",
};

export type ResourceCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  summary?: string | null;
  serviceArea?: string | null;
  phones?: Phone[] | null;
  website?: string | null;
  topics?: { title: string | null; slug: string | null }[] | null;
};

export function ResourceCard({
  resource,
  hideArea = false,
}: {
  resource: ResourceCardData;
  /** When the list is already grouped under an area heading. */
  hideArea?: boolean;
}) {
  return (
    <article className="card flex h-full flex-col gap-3">
      {resource.serviceArea && !hideArea ? (
        <p className="pill self-start">
          <MapPin className="size-4" aria-hidden="true" />
          {AREA_LABEL[resource.serviceArea]}
        </p>
      ) : null}
      <h3 className="card-title">
        <Link href={`/resources/${resource.slug}`}>{resource.title}</Link>
      </h3>
      {resource.summary ? (
        <p className="muted line-clamp-4">{resource.summary}</p>
      ) : null}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <CallButtons phones={resource.phones} max={1} />
        <Link
          href={`/resources/${resource.slug}`}
          className="inline-flex items-center gap-2 font-semibold"
        >
          Hours, address and more
          <ArrowRight className="size-5" aria-hidden="true" />
          <span className="sr-only"> about {resource.title}</span>
        </Link>
      </div>
    </article>
  );
}

export type LinkCardData = {
  _id: string;
  title: string | null;
  url: string | null;
  source?: string | null;
  summary?: string | null;
};

export function HelpfulLinkCard({ link }: { link: LinkCardData }) {
  if (!link.url) return null;
  const host = hostOf(link.url);
  return (
    <a
      href={link.url}
      rel="noopener noreferrer"
      target="_blank"
      className="card card-link flex h-full flex-col gap-3"
    >
      <span className="eyebrow">{link.source ?? host}</span>
      <span className="card-title">{link.title}</span>
      {link.summary ? (
        <span className="muted line-clamp-4">{link.summary}</span>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-2 text-base font-semibold underline underline-offset-4">
        Read on {host}
        <ArrowUpRight className="size-5" aria-hidden="true" />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export type ArticleCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  summary?: string | null;
  publishedAt?: string | null;
  author?: { name: string | null } | null;
  mainImage?: SanityImageData | null;
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="card flex h-full flex-col gap-3 overflow-hidden p-0">
      {article.mainImage?.id ? (
        <SanityImage
          image={article.mainImage}
          alt=""
          width={640}
          height={360}
          className="aspect-video w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="muted text-base">
          {[article.author?.name, formatLongDate(article.publishedAt)]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h3 className="card-title">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.summary ? (
          <p className="muted line-clamp-3">{article.summary}</p>
        ) : null}
      </div>
    </article>
  );
}

function dateParts(iso: string) {
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: SITE_TIME_ZONE,
      ...options,
    }).format(new Date(iso));
  return {
    weekday: format({ weekday: "short" }),
    day: format({ day: "numeric" }),
    month: format({ month: "short" }),
  };
}

/** One event date: a calendar tile, then title, time and place. */
export function EventRow({
  occurrence,
  dark = false,
}: {
  occurrence: Occurrence;
  showDate?: boolean;
  dark?: boolean;
}) {
  const { weekday, day, month } = dateParts(occurrence.at);
  return (
    <article
      className={`card flex h-full items-start gap-5 ${dark ? "card-dark" : ""}`}
    >
      <p
        className="flex w-20 shrink-0 flex-col items-center rounded-[var(--msl-radius-sm)] bg-[var(--msl-yellow)] px-2 py-2 text-center text-[var(--msl-green)]"
        aria-hidden="true"
      >
        <span className="text-sm font-semibold uppercase">{month}</span>
        <span className="text-3xl font-bold leading-none">{day}</span>
        <span className="text-sm font-semibold">{weekday}</span>
      </p>
      <div className="flex flex-col gap-1.5">
        <h3 className="card-title">
          <Link href={`/events/${occurrence.slug}`}>
            <span className="sr-only">
              {weekday} {month} {day}:{" "}
            </span>
            {occurrence.title}
          </Link>
        </h3>
        <p className="inline-flex items-center gap-2">
          <Clock className="size-5 shrink-0" aria-hidden="true" />
          <span className="font-semibold">{timeRange(occurrence)}</span>
        </p>
        {occurrence.location ? (
          <p
            className={`inline-flex items-center gap-2 ${dark ? "" : "muted"}`}
          >
            <MapPin className="size-5 shrink-0" aria-hidden="true" />
            {occurrence.location}
          </p>
        ) : null}
        {occurrence.status && occurrence.status !== "scheduled" ? (
          <p className="font-bold text-[var(--msl-warning-line)]">
            {{
              cancelled: "Cancelled",
              postponed: "Postponed",
              movedOnline: "Moved online",
              rescheduled: "New date",
            }[String(occurrence.status)] ?? ""}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          {occurrence.hostedByMsl ? (
            <span className="pill text-[var(--msl-green)]">
              Hosted by Maricopa Senior Living
            </span>
          ) : null}
          {occurrence.repeats ? (
            <span className="pill text-[var(--msl-green)]">Repeats</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
