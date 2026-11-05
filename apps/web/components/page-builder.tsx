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
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";
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
  children,
  id,
}: {
  heading?: string | null;
  intro?: string | null;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="container-page py-8" id={id}>
      {heading ? <h2>{heading}</h2> : null}
      {intro ? <p className="mt-2 measure text-lg">{intro}</p> : null}
      <div className={heading || intro ? "mt-5" : ""}>{children}</div>
    </section>
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
    </a>
  ) : (
    <Link href={target.href} className={className}>
      {link.label}
    </Link>
  );
}

function HeroBlock({ block }: Props) {
  const image = block.image as SanityImageData | undefined;
  return (
    <section className="bg-[var(--msl-sky)]">
      <div className="container-page grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-14">
        <div>
          <h1>{block.heading}</h1>
          {block.text ? <p className="mt-3 text-xl">{block.text}</p> : null}
          {block.showSearch !== false ? (
            <form action="/search" method="get" role="search" className="mt-6">
              <label htmlFor="hero-search" className="label text-lg">
                What are you looking for?
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  required
                  className="input"
                  placeholder="For example: meals, rides, Medicare"
                />
                <button type="submit" className="btn shrink-0">
                  Search
                </button>
              </div>
            </form>
          ) : null}
          {block.buttons?.length ? (
            <div className="mt-5 flex flex-wrap gap-3">
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
        {image?.id ? (
          <SanityImage
            image={image}
            width={1024}
            loading="eager"
            className="h-auto w-full rounded-[var(--msl-radius)] border-4 border-[var(--msl-surface)] shadow-md"
          />
        ) : null}
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
      heading={block.heading ?? "What do you need help with?"}
      intro={block.intro}
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(topics ?? []).map((topic) => (
          <li key={topic._id}>
            <Link
              href={`/topics/${topic.slug}`}
              className="card card-link flex h-full items-start gap-4"
            >
              <TopicIcon name={topic.icon} />
              <span>
                <span className="card-title block">{topic.title}</span>
                <span className="mt-1 block text-base muted">
                  {topic.description}
                </span>
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
    <Section heading={block.heading ?? "This month in Maricopa"}>
      <div className="card bg-[var(--msl-sage)]">
        <p className="eyebrow">
          What's New — {monthLabel(update.month ?? month)}
        </p>
        {update.intro ? (
          <p className="mt-2 measure text-lg">{update.intro}</p>
        ) : null}
        <p className="mt-4">
          <Link href={`/whats-new/${update.month}`} className="btn">
            {block.buttonLabel ?? "Read this month's What's New"}
          </Link>
        </p>
      </div>
    </Section>
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
    <Section heading={block.heading ?? "Coming up"} intro={block.intro}>
      {occurrences.length ? (
        <ul className="flex flex-col gap-3">
          {occurrences.map((occurrence) => (
            <li key={occurrence.key}>
              <EventRow occurrence={occurrence} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">
          No events are listed for the next two months yet.
        </p>
      )}
      <p className="mt-5">
        <Link href="/events" className="btn btn-secondary">
          See the full events calendar
        </Link>
      </p>
    </Section>
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
    <Section heading={block.heading ?? "Important phone numbers"}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(block.contacts ?? []).map(
          (contact: {
            _key: string;
            name?: string;
            note?: string;
            number?: { number?: string };
          }) =>
            contact.number?.number ? (
              <li key={contact._key} className="card">
                <p className="font-bold text-lg">{contact.name}</p>
                {contact.note ? (
                  <p className="text-base muted">{contact.note}</p>
                ) : null}
                <a
                  href={telHref(contact.number.number)}
                  className="btn btn-call mt-3 w-full"
                >
                  <span aria-hidden="true">📞</span> {contact.number.number}
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
    <Section heading={block.heading ?? "Contact us"} intro={block.intro}>
      <div className="card flex flex-col gap-3">
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
    <section className="bg-[var(--msl-sand)]">
      <div className="container-page flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="measure">
          <h2>{block.heading ?? "Support Maricopa Senior Living"}</h2>
          {block.text ? <p className="mt-2 text-lg">{block.text}</p> : null}
        </div>
        <a
          href={settings.donateUrl}
          className="btn shrink-0"
          rel="noopener noreferrer"
          target="_blank"
        >
          Donate<span className="sr-only"> (opens PayPal in a new tab)</span>
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
    <Section
      heading={block.heading ?? settings?.newsletterTitle ?? "Newsletter"}
    >
      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="measure">
          {block.text ? <p className="text-lg">{block.text}</p> : null}
          {settings?.subscribeInstructions ? (
            <p className="mt-2">{settings.subscribeInstructions}</p>
          ) : null}
        </div>
        {latest?.month ? (
          <Link href={`/newsletter/${latest.month}`} className="btn shrink-0">
            Read the {monthLabel(latest.month)} issue
          </Link>
        ) : null}
      </div>
    </Section>
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
        <span aria-hidden="true">📄</span>{" "}
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
