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
  ArrowUpRight,
  FileText,
  HeartHandshake,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";

import { monthKey, monthLabel } from "@/lib/dates";
import { expandOccurrences } from "@/lib/events";
import { type LinkValue, resolveLink, telHref } from "@/lib/links";
import {
  ArticleCard,
  type ArticleCardData,
  EventRow,
  HelpfulLinkCard,
  ResourceCard,
} from "./cards";
import { RichText } from "./rich-text";
import { SanityImage, type SanityImageData } from "./sanity-image";
import { TopicIcon } from "./topic-icon";

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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
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

async function HeroBlock({ block, perspective, stega }: Props) {
  const image = block.image as SanityImageData | undefined;
  const { data: stats } = await cachedSanity({
    query: queryStats,
    perspective,
    stega,
  });
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--msl-cream-2)] to-[var(--msl-cream)]">
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div>
          <p className="eyebrow">Maricopa, Arizona</p>
          <h1 className="mt-3">{block.heading}</h1>
          {block.text ? (
            <p className="lead muted mt-4 measure">{block.text}</p>
          ) : null}
          {block.showSearch !== false ? (
            <form
              action="/search"
              method="get"
              role="search"
              className="mt-8 max-w-xl"
            >
              <label htmlFor="hero-search" className="label">
                What are you looking for?
              </label>
              <div className="flex flex-col gap-2 rounded-[2rem] border-2 border-[var(--msl-line-strong)] bg-white p-1.5 sm:flex-row sm:items-center">
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  required
                  className="input border-0"
                  placeholder="Meals, rides, Medicare…"
                />
                <button type="submit" className="btn btn-yellow shrink-0">
                  <Search className="size-5" aria-hidden="true" />
                  Search
                </button>
              </div>
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
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold">
            <li className="eyebrow text-[var(--msl-ink)]">Places to call</li>
            <li className="eyebrow text-[var(--msl-ink)]">Events calendar</li>
            <li className="eyebrow text-[var(--msl-ink)]">
              Monthly newsletter
            </li>
          </ul>
        </div>
        <div className="relative">
          {image?.id ? (
            <SanityImage
              image={image}
              width={900}
              height={680}
              loading="eager"
              className="aspect-[4/3] h-auto w-full rounded-[var(--msl-radius-lg)] object-cover shadow-lg"
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-[var(--msl-radius-lg)] bg-[var(--msl-sage)]" />
          )}
          <div className="card absolute -bottom-6 left-4 right-4 flex items-center gap-4 p-4 sm:left-8 sm:right-auto sm:max-w-sm">
            <span className="icon-circle">
              <MapPin className="size-6" aria-hidden="true" />
            </span>
            <p className="text-base">
              <strong className="block text-lg">
                {stats?.resources ?? 0} local places to call
              </strong>
              <span className="muted">
                in {stats?.topics ?? 0} topics, from meals to Medicare
              </span>
            </p>
          </div>
        </div>
      </div>
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
      eyebrow="Find help"
      heading={block.heading ?? "What do you need help with?"}
      intro={block.intro}
      action={
        <Link href="/resources" className="btn btn-secondary">
          See all resources
          <Arrow />
        </Link>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(topics ?? []).map((topic) => (
          <li key={topic._id}>
            <Link
              href={`/topics/${topic.slug}`}
              className="card card-link flex h-full flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <TopicIcon name={topic.icon} />
                <ArrowUpRight
                  className="size-6 text-[var(--msl-ink-soft)]"
                  aria-hidden="true"
                />
              </div>
              <span className="card-title">{topic.title}</span>
              <span className="muted text-base">{topic.description}</span>
              <span className="pill mt-auto self-start">
                {topic.resourceCount} places to call
              </span>
            </Link>
          </li>
        ))}
      </ul>
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
    <section className="container-page section">
      <div className="band-sage grid gap-6 rounded-[var(--msl-radius-lg)] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div className="measure">
          <p className="eyebrow">
            What's New — {monthLabel(update.month ?? month)}
          </p>
          <h2 className="mt-2">{block.heading ?? "This month in Maricopa"}</h2>
          {update.intro ? <p className="lead mt-3">{update.intro}</p> : null}
        </div>
        <Link
          href={`/whats-new/${update.month}`}
          className="btn self-start md:self-center"
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
    <section className="band-dark">
      <div className="container-page section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="measure">
            <p className="eyebrow">Events</p>
            <h2 className="mt-2">{block.heading ?? "Coming up"}</h2>
            {block.intro ? (
              <p className="lead muted mt-3">{block.intro}</p>
            ) : null}
          </div>
          <Link href="/events" className="btn btn-yellow">
            Full events calendar
            <Arrow />
          </Link>
        </div>
        {occurrences.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {occurrences.map((occurrence) => (
              <li key={occurrence.key}>
                <EventRow occurrence={occurrence} dark />
              </li>
            ))}
          </ul>
        ) : (
          <p className="lead muted">
            No events are listed for the next two months yet. Check back soon.
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
  const address = useSite ? settings?.mailingAddress : block.address;
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
          </div>
        </div>
        <a
          href={settings.donateUrl}
          className="btn btn-yellow shrink-0"
          rel="noopener noreferrer"
          target="_blank"
        >
          Donate
          <span className="sr-only"> (opens PayPal in a new tab)</span>
          <Arrow />
        </a>
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
    <section className="container-page section">
      <div className="band-dark grid gap-6 rounded-[var(--msl-radius-lg)] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
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
  return (
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
                            className="h-auto w-full rounded-md"
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
                  className={`rounded-[var(--msl-radius)] border-l-8 p-5 text-lg ${
                    block.tone === "warning"
                      ? "border-[var(--msl-warning-line)] bg-[var(--msl-warning-bg)]"
                      : "border-[var(--msl-link)] bg-[var(--msl-sky)]"
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
