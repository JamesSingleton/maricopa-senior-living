import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { formatLongDate, SITE_TIME_ZONE } from "@/lib/dates";
import { type Occurrence, timeRange } from "@/lib/events";
import { hostOf, telHref } from "@/lib/links";
import { SanityImage, type SanityImageData } from "./sanity-image";

type Phone = { _key?: string; label?: string | null; number?: string | null };

/** Green "Call" buttons, one per number, with the label underneath. */
export function CallButtons({
  phones,
  max = 3,
}: {
  phones?: Phone[] | null;
  max?: number;
}) {
  const list = (phones ?? []).filter((p) => p.number).slice(0, max);
  if (!list.length) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {list.map((phone) => (
        <li key={phone._key ?? phone.number}>
          <a href={telHref(phone.number as string)} className="btn btn-call">
            <Phone className="size-5" aria-hidden="true" />
            <span>
              {phone.label ? (
                <span className="sr-only">{phone.label}: </span>
              ) : null}
              Call {phone.number}
            </span>
          </a>
          {phone.label ? (
            <p className="muted mt-1 pl-4 text-base">{phone.label}</p>
          ) : null}
        </li>
      ))}
    </ul>
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

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  return (
    <article className="card flex h-full flex-col gap-3">
      {resource.serviceArea ? (
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
  return (
    <article className="card flex h-full flex-col gap-3">
      <p className="eyebrow">{link.source ?? hostOf(link.url)}</p>
      <h3 className="card-title">
        <a href={link.url} rel="noopener noreferrer" target="_blank">
          {link.title}
          <span className="sr-only">
            {" "}
            (opens {hostOf(link.url)} in a new tab)
          </span>
        </a>
      </h3>
      {link.summary ? (
        <p className="muted line-clamp-4">{link.summary}</p>
      ) : null}
      <p className="mt-auto inline-flex items-center gap-2 text-base font-semibold">
        Read on {hostOf(link.url)}
        <ArrowUpRight className="size-5" aria-hidden="true" />
      </p>
    </article>
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
