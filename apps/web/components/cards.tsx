import Link from "next/link";

import { formatDayHeading, formatLongDate } from "@/lib/dates";
import { type Occurrence, timeRange } from "@/lib/events";
import { hostOf, telHref } from "@/lib/links";
import { SanityImage, type SanityImageData } from "./sanity-image";

type Phone = { _key?: string; label?: string | null; number?: string | null };

/** Big green "Call" buttons, one per number. */
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
    <ul className="flex flex-wrap gap-2">
      {list.map((phone) => (
        <li key={phone._key ?? phone.number}>
          <a href={telHref(phone.number as string)} className="btn btn-call">
            <span aria-hidden="true">📞</span>
            <span>
              {phone.label ? (
                <span className="sr-only">{phone.label}: </span>
              ) : null}
              Call {phone.number}
            </span>
          </a>
          {phone.label ? (
            <p className="mt-1 text-base muted">{phone.label}</p>
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
        <p className="eyebrow">{AREA_LABEL[resource.serviceArea]}</p>
      ) : null}
      <h3 className="card-title">
        <Link href={`/resources/${resource.slug}`}>{resource.title}</Link>
      </h3>
      {resource.summary ? <p>{resource.summary}</p> : null}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <CallButtons phones={resource.phones} max={1} />
        <Link href={`/resources/${resource.slug}`} className="font-bold">
          Hours, address and more
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
    <article className="card flex h-full flex-col gap-2">
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
      {link.summary ? <p>{link.summary}</p> : null}
      <p className="mt-auto text-base muted">Opens {hostOf(link.url)}</p>
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
    <article className="card flex h-full flex-col gap-3">
      {article.mainImage?.id ? (
        <SanityImage
          image={article.mainImage}
          alt=""
          width={640}
          height={360}
          className="aspect-video w-full rounded-md object-cover"
        />
      ) : null}
      <h3 className="card-title">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="text-base muted">
        {[article.author?.name, formatLongDate(article.publishedAt)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {article.summary ? <p>{article.summary}</p> : null}
    </article>
  );
}

/** One event date: day, time, place. */
export function EventRow({
  occurrence,
  showDate = true,
}: {
  occurrence: Occurrence;
  showDate?: boolean;
}) {
  return (
    <article className="card flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-6">
      {showDate ? (
        <p className="shrink-0 font-bold sm:w-56">
          {formatDayHeading(occurrence.at)}
        </p>
      ) : null}
      <div className="flex flex-col gap-1">
        <h3 className="card-title">
          <Link href={`/events/${occurrence.slug}`}>{occurrence.title}</Link>
        </h3>
        <p>
          <span className="font-bold">{timeRange(occurrence)}</span>
          {occurrence.location ? ` · ${occurrence.location}` : null}
        </p>
        {occurrence.hostedByMsl ? (
          <p className="eyebrow">Hosted by Maricopa Senior Living</p>
        ) : null}
        {occurrence.repeats ? <p className="text-base muted">Repeats</p> : null}
      </div>
    </article>
  );
}
