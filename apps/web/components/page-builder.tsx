import {
  cachedNow,
  cachedSanity,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryArticlesSlice,
  queryCurrentMonthlyUpdate,
  queryEventsInRange,
  queryLinksByTopic,
  queryNewsletterList,
  queryResourcesByTopicSlug,
  querySettings,
  queryStats,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
import {
  ArrowRight,
  FileText,
  HeartHandshake,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";

import { addressText } from "@/lib/address";
import { monthKey, monthLabel } from "@/lib/dates";
import { expandOccurrences } from "@/lib/events";
import { type LinkValue, resolveLink, telHref } from "@/lib/links";
import { faqLd, imageUrl } from "@/lib/structured-data";
import {
  ArticleCard,
  type ArticleCardData,
  EventRow,
  HelpfulLinkCard,
  ResourceCard,
} from "./cards";
import { JsonLd } from "./json-ld";
import { RichText } from "./rich-text";
import { SanityImage, type SanityImageData } from "./sanity-image";
import { TopicTiles } from "./topic-tiles";

type Block = Record<string, any> & { _key: string; _type: string };
type Props = DynamicFetchOptions & { block: Block };

function Section({
  heading,
  intro,
  eyebrow,
  children,
  id,
  action,
}: {
  heading?: string | null;
  intro?: string | null;
  eyebrow?: string | null;
  children: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="container-page section" id={id}>
      {heading || intro || eyebrow ? (
        <div className="ruled mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="measure">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {heading ? <h2 className="mt-2">{heading}</h2> : null}
            {intro ? <p className="lead muted mt-3">{intro}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function Arrow() {
  return (
    <span className="btn-arrow">
      <ArrowRight className="size-5" aria-hidden="true" />
    </span>
  );
}

function LinkButton({
  link,
  secondary,
}: {
  link: LinkValue;
  secondary?: boolean;
}) {
  const target = resolveLink(link);
  if (!target || !link?.label) return null;
  const className = secondary ? "btn btn-secondary" : "btn";
  return target.external ? (
    <a
      href={target.href}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      {link.label}
      <span className="sr-only"> (opens in a new tab)</span>
      <Arrow />
    </a>
  ) : (
    <Link href={target.href} className={className}>
      {link.label}
      <Arrow />
    </Link>
  );
}

const DOORS = [
  {
    href: "/resources",
    title: "Find a place to call",
    text: "Meals, rides, Medicare, care at home and more.",
    className: "band-gold",
  },
  {
    href: "/events",
    title: "See what's happening",
    text: "Classes, lunches, clubs and outings near you.",
    className: "band-clay",
  },
  {
    href: "/whats-new",
    title: "Read this month's news",
    text: "What's new in Maricopa for seniors.",
    className: "band-sage",
  },
];

async function HeroBlock({ block, perspective, stega }: Props) {
  const image = block.image as SanityImageData | undefined;
  const { data: stats } = await cachedSanity({
    query: queryStats,
    perspective,
    stega,
  });
  return (
    <section>
      {/* Two flat panels: words and search on ink, the photograph running
          to the edge of the screen. */}
      <div className="band-dark grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex justify-end">
          <div className="w-full max-w-[calc(var(--msl-max)*0.55)] px-[1.1rem] py-12 md:px-10 lg:py-20">
            <p className="eyebrow">Maricopa, Arizona</p>
            <h1 className="mt-4">{block.heading}</h1>
            {block.text ? (
              <p className="lead mt-5 max-w-[34ch]">{block.text}</p>
            ) : null}
            {block.showSearch !== false ? (
              <form
                action="/search"
                method="get"
                role="search"
                className="mt-8 max-w-xl"
              >
                <label htmlFor="hero-search" className="label text-lg">
                  What are you looking for?
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                  <input
                    id="hero-search"
                    name="q"
                    type="search"
                    required
                    className="input min-h-[3.6rem] border-white text-lg sm:rounded-r-none"
                    placeholder="For example: meals"
                  />
                  <button
                    type="submit"
                    className="btn btn-yellow min-h-[3.6rem] shrink-0 px-7 text-lg sm:rounded-l-none"
                  >
                    <Search className="size-5" aria-hidden="true" />
                    Search
                  </button>
                </div>
                <p className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-base font-bold">
                    People often look for:
                  </span>
                  {["Meals", "Rides", "Medicare", "Caregiving", "Housing"].map(
                    (term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
                        className="chip"
                      >
                        {term}
                      </Link>
                    ),
                  )}
                </p>
              </form>
            ) : null}
            {block.buttons?.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {block.buttons.map(
                  (link: LinkValue & { _key: string }, index: number) => (
                    <LinkButton
                      key={link._key}
                      link={link}
                      secondary={index > 0}
                    />
                  ),
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="relative min-h-[18rem] bg-[var(--msl-green-2)] lg:min-h-0">
          {image?.id ? (
            <SanityImage
              image={image}
              width={1100}
              height={900}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <p className="band-gold absolute bottom-0 left-0 max-w-[19rem] px-6 py-5 text-lg font-bold leading-snug">
            <span className="font-display block text-6xl leading-none">
              {stats?.resources ?? 0}
            </span>
            local places to call, sorted into {stats?.topics ?? 0} plain topics
          </p>
        </div>
      </div>
      <nav aria-label="Start here">
        <ul className="grid md:grid-cols-3">
          {DOORS.map((door) => (
            <li key={door.href} className={door.className}>
              <Link href={door.href} className="block-link">
                <ArrowRight className="size-9" aria-hidden="true" />
                <span>
                  <span className="index-title block">{door.title}</span>
                  <span className="mt-2 block text-lg">{door.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

async function TopicsBlock({ block, perspective, stega }: Props) {
  const { data: topics } = await cachedSanity({
    query: queryTopics,
    perspective,
    stega,
  });
  return (
    <Section
      eyebrow="Find help by topic"
      heading={block.heading ?? "What do you need help with?"}
      intro={block.intro}
      action={
        <Link href="/resources" className="btn btn-secondary">
          See all resources
          <Arrow />
        </Link>
      }
    >
      <TopicTiles topics={topics ?? []} />
    </Section>
  );
}

async function WhatsNewBlock({ block, perspective, stega }: Props) {
  const month = monthKey(await cachedNow());
  const { data: update } = await cachedSanity({
    query: queryCurrentMonthlyUpdate,
    params: { month },
    perspective,
    stega,
  });
  if (!update) return null;
  return (
    <section className="band-clay">
      <div className="container-page section grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow">
            What's New — {monthLabel(update.month ?? month)}
          </p>
          <h2 className="mt-3">{block.heading ?? "This month in Maricopa"}</h2>
          {update.intro ? (
            <p className="lead mt-4 measure">{update.intro}</p>
          ) : null}
        </div>
        <Link
          href={`/whats-new/${update.month}`}
          className="btn btn-yellow self-start text-lg md:self-end"
        >
          {block.buttonLabel ?? "Read this month's What's New"}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

async function EventListBlock({ block, perspective, stega }: Props) {
  const now = new Date(await cachedNow());
  const to = new Date(now.getTime() + 60 * 24 * 3600 * 1000);
  const { data } = await cachedSanity({
    query: queryEventsInRange,
    params: {
      from: now.toISOString(),
      to: to.toISOString(),
      topicId: block.mode === "topic" ? (block.topicId ?? "") : "",
      mslOnly: block.mode === "msl",
    },
    perspective,
    stega,
  });
  const occurrences = expandOccurrences(data ?? [], now, to).slice(
    0,
    block.limit ?? 5,
  );
  return (
    <section>
      <div className="container-page section">
        <div className="ruled mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="measure">
            <p className="eyebrow">Events</p>
            <h2 className="mt-2">{block.heading ?? "Coming up"}</h2>
            {block.intro ? (
              <p className="lead muted mt-3">{block.intro}</p>
            ) : null}
          </div>
          <Link href="/events" className="btn btn-secondary">
            Full events calendar
            <Arrow />
          </Link>
        </div>
        {occurrences.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {occurrences.map((occurrence) => (
              <li key={occurrence.key}>
                <EventRow occurrence={occurrence} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="lead muted">
            No events are listed for the next two months yet. Check back soon,
            or read this month's <Link href="/whats-new">What's New</Link>.
          </p>
        )}
      </div>
    </section>
  );
}

async function ResourceListBlock({ block, perspective, stega }: Props) {
  let resources = block.picked ?? [];
  if (block.mode !== "manual" && block.topicSlug) {
    const { data } = await cachedSanity({
      query: queryResourcesByTopicSlug,
      params: { topic: block.topicSlug },
      perspective,
      stega,
    });
    resources = data ?? [];
  }
  resources = resources.filter(Boolean).slice(0, block.limit ?? 6);
  if (!resources.length) return null;
  return (
    <Section heading={block.heading} intro={block.intro}>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map(
          (resource: Parameters<typeof ResourceCard>[0]["resource"]) => (
            <li key={resource._id}>
              <ResourceCard resource={resource} />
            </li>
          ),
        )}
      </ul>
      {block.mode !== "manual" && block.topicSlug ? (
        <p className="mt-5">
          <Link
            href={`/topics/${block.topicSlug}`}
            className="btn btn-secondary"
          >
            See all {block.topicTitle ?? ""} resources
          </Link>
        </p>
      ) : null}
    </Section>
  );
}

async function ArticleListBlock({ block, perspective, stega }: Props) {
  const limit = Math.min(Math.max(block.limit ?? 3, 1), 12);
  const { data } = await cachedSanity({
    query: queryArticlesSlice(0, limit),
    params: {
      series: block.mode === "joans-corner" ? "joans-corner" : "",
      topicId: block.mode === "topic" ? (block.topicId ?? "") : "",
    },
    perspective,
    stega,
  });
  const articles = (data ?? []) as ArticleCardData[];
  if (!articles.length) return null;
  return (
    <Section heading={block.heading ?? "Recent articles"}>
      <ul className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <li key={article._id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

async function LinkListBlock({ block, perspective, stega }: Props) {
  let links = block.picked ?? [];
  if (block.mode !== "manual" && block.topicId) {
    const { data } = await cachedSanity({
      query: queryLinksByTopic,
      params: { topicId: block.topicId },
      perspective,
      stega,
    });
    links = data ?? [];
  }
  links = links.filter(Boolean).slice(0, block.limit ?? 6);
  if (!links.length) return null;
  return (
    <Section heading={block.heading ?? "Helpful links"} intro={block.intro}>
      <ul className="grid gap-4 md:grid-cols-2">
        {links.map((link: Parameters<typeof HelpfulLinkCard>[0]["link"]) => (
          <li key={link._id}>
            <HelpfulLinkCard link={link} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function QuickContactsBlock({ block }: Props) {
  return (
    <Section
      eyebrow="Phone numbers"
      heading={block.heading ?? "Important phone numbers"}
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(block.contacts ?? []).map(
          (contact: {
            _key: string;
            name?: string;
            note?: string;
            number?: { number?: string };
          }) =>
            contact.number?.number ? (
              <li key={contact._key} className="card flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="icon-circle">
                    <Phone className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold leading-snug">
                      {contact.name}
                    </p>
                    {contact.note ? (
                      <p className="muted text-base">{contact.note}</p>
                    ) : null}
                  </div>
                </div>
                <a
                  href={telHref(contact.number.number)}
                  className="btn btn-call mt-auto w-full"
                >
                  Call {contact.number.number}
                </a>
              </li>
            ) : null,
        )}
      </ul>
    </Section>
  );
}

async function ContactBlock({ block, perspective, stega }: Props) {
  const { data: settings } = await cachedSanity({
    query: querySettings,
    perspective,
    stega,
  });
  const useSite = block.useSiteContact !== false;
  const phone = useSite ? settings?.contactPhone?.number : block.phone?.number;
  const email = useSite ? settings?.contactEmail : block.email;
  const address = useSite
    ? addressText(settings?.mailingAddress ?? null)
    : block.address;
  return (
    <Section
      eyebrow="Contact"
      heading={block.heading ?? "Contact us"}
      intro={block.intro}
    >
      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
        {phone ? (
          <a href={telHref(phone)} className="btn btn-call self-start">
            Call {phone}
          </a>
        ) : null}
        {email ? (
          <p className="text-lg">
            Email: <a href={`mailto:${email}`}>{email}</a>
          </p>
        ) : null}
        {address ? (
          <p className="whitespace-pre-line text-lg">{address}</p>
        ) : null}
      </div>
    </Section>
  );
}

async function DonateBlock({ block, perspective, stega }: Props) {
  const { data: settings } = await cachedSanity({
    query: querySettings,
    perspective,
    stega,
  });
  if (!settings?.donateUrl) return null;
  const details = block.showDetails === true;
  return (
    <section className="container-page section">
      <div className="card card-soft flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex items-start gap-5">
          <span className="icon-circle hidden sm:grid">
            <HeartHandshake className="size-6" aria-hidden="true" />
          </span>
          <div className="measure">
            <p className="eyebrow">Support our work</p>
            <h2 className="mt-2">
              {block.heading ?? "Support Maricopa Senior Living"}
            </h2>
            {block.text ? <p className="lead mt-3">{block.text}</p> : null}
            {details && settings.mission ? (
              <p className="mt-3">{settings.mission}</p>
            ) : null}
          </div>
        </div>
        <a
          href={settings.donateUrl}
          className="btn btn-clay shrink-0 text-lg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Donate online
          <span className="sr-only"> (opens PayPal in a new tab)</span>
          <Arrow />
        </a>
      </div>
      {details ? (
        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="card">
            <dt className="card-title">Tax-deductible</dt>
            <dd className="mt-2">
              {settings.nonprofitStatement}{" "}
              {settings.taxDeductibleNote ??
                "Donations are tax-deductible to the extent allowed by law."}
            </dd>
          </div>
          {settings.ein ? (
            <div className="card">
              <dt className="card-title">Tax ID (EIN)</dt>
              <dd className="mt-2">
                <span className="text-xl font-bold">{settings.ein}</span>
                {settings.charityProfileUrl ? (
                  <a
                    href={settings.charityProfileUrl}
                    className="mt-2 block"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    See our charity profile
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </dd>
            </div>
          ) : null}
          {settings.donateByMail ? (
            <div className="card">
              <dt className="card-title">Give by check</dt>
              <dd className="mt-2 whitespace-pre-line">
                {settings.donateByMail}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </section>
  );
}

type Person = {
  _key: string;
  name?: string;
  role?: string;
  bio?: string;
  image?: SanityImageData;
};

function PeopleBlock({ block }: Props) {
  const people = (block.people ?? []) as Person[];
  if (!people.length) return null;
  return (
    <Section heading={block.heading ?? "Our people"} intro={block.intro}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <li key={person._key} className="card flex gap-4">
            {person.image?.id ? (
              <SanityImage
                image={person.image}
                width={160}
                height={160}
                className="size-20 shrink-0 object-cover"
              />
            ) : null}
            <div>
              <h3 className="card-title">{person.name}</h3>
              {person.role ? (
                <p className="font-bold text-[var(--msl-clay)]">
                  {person.role}
                </p>
              ) : null}
              {person.bio ? <p className="muted mt-2">{person.bio}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DocumentsBlock({ block }: Props) {
  const documents = (
    (block.documents ?? []) as {
      _key: string;
      title?: string;
      file?: { url?: string; size?: number; extension?: string };
    }[]
  ).filter((doc) => doc.file?.url);
  if (!documents.length) return null;
  return (
    <Section heading={block.heading ?? "Documents"} intro={block.intro}>
      <ul className="flex max-w-3xl flex-col gap-3">
        {documents.map((doc) => (
          <li key={doc._key}>
            <a
              href={doc.file?.url}
              className="tile flex min-h-[3.5rem] items-center gap-4 px-5 py-3"
            >
              <FileText className="size-6 shrink-0" aria-hidden="true" />
              <span className="card-title">{doc.title}</span>
              <span className="muted ml-auto shrink-0 text-base">
                {(doc.file?.extension ?? "pdf").toUpperCase()}
                {doc.file?.size
                  ? `, ${Math.max(1, Math.round(doc.file.size / 1024))} KB`
                  : ""}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function SupportersBlock({ block }: Props) {
  const supporters = (block.supporters ?? []) as {
    _key: string;
    name?: string;
    url?: string;
    logoId?: string;
  }[];
  if (!supporters.length) return null;
  return (
    <Section
      heading={block.heading ?? "Supporters and partners"}
      intro={block.intro}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supporters.map((supporter) => {
          const logo = imageUrl(supporter.logoId, 320);
          const inner = (
            <>
              {logo ? (
                // biome-ignore lint/performance/noImgElement: small logo, any aspect ratio
                <img
                  src={logo}
                  alt=""
                  loading="lazy"
                  className="max-h-16 w-auto max-w-full object-contain"
                />
              ) : null}
              <span className="font-bold">{supporter.name}</span>
            </>
          );
          const className =
            "card flex h-full flex-col items-center justify-center gap-3 text-center";
          return (
            <li key={supporter._key}>
              {supporter.url ? (
                <a
                  href={supporter.url}
                  className={`${className} card-link`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {inner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <div className={className}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

async function ImpactBlock({ block, perspective, stega }: Props) {
  const { data: site } =
    block.showSiteNumbers !== false
      ? await cachedSanity({ query: queryStats, perspective, stega })
      : { data: null };
  const stats = [
    ...(site
      ? [
          { value: String(site.resources), label: "local places to call" },
          {
            value: String(site.links),
            label: "helpful links, checked by hand",
          },
          { value: String(site.topics), label: "plain topics to browse" },
        ]
      : []),
    ...((block.stats ?? []) as { value?: string; label?: string }[]).map(
      (stat) => ({ value: stat.value ?? "", label: stat.label ?? "" }),
    ),
  ].filter((stat) => stat.value);
  if (!stats.length) return null;
  return (
    <section className="band-dark">
      <div className="container-page section">
        {block.heading ? <h2 className="mb-8">{block.heading}</h2> : null}
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse border-t-4 border-[var(--msl-yellow)] pt-4"
            >
              <dt className="muted">{stat.label}</dt>
              <dd className="font-display text-5xl font-semibold text-[var(--msl-yellow)]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

async function NewsletterSignupBlock({ block, perspective, stega }: Props) {
  const month = monthKey(await cachedNow());
  const [{ data: settings }, { data: editions }] = await Promise.all([
    cachedSanity({ query: querySettings, perspective, stega }),
    cachedSanity({
      query: queryNewsletterList,
      params: { month },
      perspective,
      stega,
    }),
  ]);
  const latest = block.showLatest !== false ? editions?.[0] : null;
  return (
    <section className="band-dark">
      <div className="container-page section grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="measure">
          <p className="eyebrow">Monthly newsletter</p>
          <h2 className="mt-2">
            {block.heading ?? settings?.newsletterTitle ?? "Newsletter"}
          </h2>
          {block.text ? <p className="lead mt-3">{block.text}</p> : null}
          {settings?.subscribeInstructions ? (
            <p className="muted mt-3">{settings.subscribeInstructions}</p>
          ) : null}
        </div>
        {latest?.month ? (
          <Link
            href={`/newsletter/${latest.month}`}
            className="btn btn-yellow self-start md:self-center"
          >
            Read the {monthLabel(latest.month)} issue
            <Arrow />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function FaqBlock({ block }: Props) {
  const items = (block.items ?? []) as {
    question?: string;
    answerText?: string;
  }[];
  return (
    <>
      <JsonLd
        data={faqLd(
          items.map((i) => ({ question: i.question, answer: i.answerText })),
        )}
      />
      <Section heading={block.heading ?? "Questions and answers"}>
        <div className="flex flex-col gap-3">
          {(block.items ?? []).map(
            (item: { _key: string; question?: string; answer?: unknown[] }) => (
              <details key={item._key} className="card">
                <summary className="cursor-pointer text-lg font-bold">
                  {item.question}
                </summary>
                <div className="mt-3">
                  <RichText value={item.answer} />
                </div>
              </details>
            ),
          )}
        </div>
      </Section>
    </>
  );
}

function youTubeId(url?: string) {
  const match = url?.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match?.[1];
}

function VideoBlock({ block }: Props) {
  const id = youTubeId(block.url);
  if (!id) return null;
  return (
    <Section heading={block.heading}>
      <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-[var(--msl-radius)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={block.caption ?? "Video"}
          className="h-full w-full"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      {block.caption ? <p className="mt-2 muted">{block.caption}</p> : null}
    </Section>
  );
}

function FileBlock({ block }: Props) {
  if (!block.file?.url) return null;
  return (
    <Section heading={block.heading} intro={block.intro}>
      <a href={block.file.url} className="btn">
        <FileText className="size-5" aria-hidden="true" />
        {block.buttonLabel ?? "View the file"}
        <span className="font-normal">
          {" "}
          ({(block.file.extension ?? "file").toUpperCase()})
        </span>
      </a>
    </Section>
  );
}

export async function PageBuilder({
  blocks,
  perspective,
  stega,
}: DynamicFetchOptions & { blocks?: Block[] | null }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block) => {
        const props = { block, perspective, stega };
        switch (block._type) {
          case "heroBlock":
            return <HeroBlock key={block._key} {...props} />;
          case "topicsBlock":
            return <TopicsBlock key={block._key} {...props} />;
          case "whatsNewBlock":
            return <WhatsNewBlock key={block._key} {...props} />;
          case "textBlock":
            return (
              <Section key={block._key} heading={block.heading}>
                <RichText value={block.body} />
              </Section>
            );
          case "imageBlock":
            return (
              <Section key={block._key} heading={block.heading}>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(block.images ?? []).map(
                    (
                      image: SanityImageData & {
                        _key: string;
                        caption?: string;
                      },
                    ) => (
                      <li key={image._key}>
                        <figure>
                          <SanityImage
                            image={image}
                            width={800}
                            className="h-auto w-full"
                          />
                          {image.caption ? (
                            <figcaption className="mt-2 text-base muted">
                              {image.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      </li>
                    ),
                  )}
                </ul>
              </Section>
            );
          case "buttonsBlock":
            return (
              <Section
                key={block._key}
                heading={block.heading}
                intro={block.intro}
              >
                <div className="flex flex-wrap gap-3">
                  {(block.buttons ?? []).map(
                    (link: LinkValue & { _key: string }, index: number) => (
                      <LinkButton
                        key={link._key}
                        link={link}
                        secondary={index > 0}
                      />
                    ),
                  )}
                </div>
              </Section>
            );
          case "calloutBlock":
            return (
              <section key={block._key} className="container-page py-4">
                <aside
                  className={`p-6 text-lg ${
                    block.tone === "warning"
                      ? "bg-[var(--msl-warning-bg)]"
                      : "bg-[var(--msl-sage)]"
                  }`}
                >
                  {block.tone === "warning" ? (
                    <p className="font-bold">Important</p>
                  ) : null}
                  <p className="whitespace-pre-line">{block.text}</p>
                  {block.link ? (
                    <p className="mt-3">
                      <LinkButton link={block.link} secondary />
                    </p>
                  ) : null}
                </aside>
              </section>
            );
          case "resourceListBlock":
            return <ResourceListBlock key={block._key} {...props} />;
          case "eventListBlock":
            return <EventListBlock key={block._key} {...props} />;
          case "articleListBlock":
            return <ArticleListBlock key={block._key} {...props} />;
          case "linkListBlock":
            return <LinkListBlock key={block._key} {...props} />;
          case "quickContactsBlock":
            return <QuickContactsBlock key={block._key} {...props} />;
          case "contactBlock":
            return <ContactBlock key={block._key} {...props} />;
          case "donateBlock":
            return <DonateBlock key={block._key} {...props} />;
          case "peopleBlock":
            return <PeopleBlock key={block._key} {...props} />;
          case "documentsBlock":
            return <DocumentsBlock key={block._key} {...props} />;
          case "supportersBlock":
            return <SupportersBlock key={block._key} {...props} />;
          case "impactBlock":
            return <ImpactBlock key={block._key} {...props} />;
          case "faqBlock":
            return <FaqBlock key={block._key} {...props} />;
          case "videoBlock":
            return <VideoBlock key={block._key} {...props} />;
          case "fileBlock":
            return <FileBlock key={block._key} {...props} />;
          case "newsletterSignupBlock":
            return <NewsletterSignupBlock key={block._key} {...props} />;
          default:
            return null;
        }
      })}
    </>
  );
}
