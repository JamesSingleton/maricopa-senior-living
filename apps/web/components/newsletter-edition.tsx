import {
  cachedSanity,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryEventsInRange,
  queryNewsletter,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";

import { formatTime, monthLabel, monthRange } from "@/lib/dates";
import { expandOccurrences } from "@/lib/events";
import { RichText } from "./rich-text";
import { SanityImage } from "./sanity-image";

type Edition = NonNullable<Awaited<ReturnType<typeof loadEdition>>["edition"]>;

export async function loadEdition(
  month: string,
  { perspective, stega }: DynamicFetchOptions,
) {
  const { from, to } = monthRange(month);
  const [{ data: edition }, { data: settings }, { data: events }] =
    await Promise.all([
      cachedSanity({
        query: queryNewsletter,
        params: { month },
        perspective,
        stega,
      }),
      cachedSanity({ query: querySettings, perspective, stega }),
      cachedSanity({
        query: queryEventsInRange,
        params: { from, to, topicId: "", mslOnly: false },
        perspective,
        stega,
      }),
    ]);
  const occurrences = expandOccurrences(
    events ?? [],
    new Date(from),
    new Date(to),
  );
  return { edition, settings, occurrences };
}

function shortWhen(iso: string, allDay?: boolean | null) {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "short",
    month: "numeric",
    day: "numeric",
  }).format(new Date(iso));
  return allDay ? day : `${day} – ${formatTime(iso)}`;
}

/**
 * "Keeping you informed…still" — one component for the web edition and the
 * print/PDF version (`print` tightens images so the PDF stays small).
 */
export function NewsletterEdition({
  month,
  data,
  print = false,
}: {
  month: string;
  data: Awaited<ReturnType<typeof loadEdition>>;
  print?: boolean;
}) {
  const { edition, settings, occurrences } = data;
  if (!edition) return null;
  const sections = (edition.sections ?? []) as NonNullable<Edition["sections"]>;
  const imageWidth = print ? 900 : 1200;
  const title = settings?.newsletterTitle ?? "Keeping you informed…still";

  return (
    <div className="newsletter flex flex-col gap-10">
      <header className="card border-[var(--msl-sand-strong)] bg-[var(--msl-sand)] text-center">
        <p className="font-display text-4xl">{title}</p>
        <p className="mt-1 text-lg">
          Maricopa Senior Living's monthly newsletter
        </p>
        <p className="mt-3 font-display text-3xl">{monthLabel(month)}</p>
        {settings?.newsletterDedication ? (
          <p className="mt-2 italic">{settings.newsletterDedication}</p>
        ) : null}
        {edition.coverImage?.id ? (
          <SanityImage
            image={edition.coverImage}
            width={imageWidth}
            className="mx-auto mt-5 h-auto max-h-[28rem] w-auto"
            queryParams={{ q: print ? 60 : 75 }}
          />
        ) : null}
        {edition.coverMessage ? (
          <p className="mt-4 font-display text-2xl">{edition.coverMessage}</p>
        ) : null}
        {sections.length > 1 ? (
          <nav aria-label="In this issue" className="mt-6 text-left">
            <p className="font-bold">In this issue</p>
            <ol className="mt-2 list-decimal pl-6">
              {sections.map((section) => (
                <li key={section._key}>
                  <a href={`#${section._key}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {settings?.subscribeInstructions ? (
          <p className="mt-5 font-bold">{settings.subscribeInstructions}</p>
        ) : null}
      </header>

      {sections.map((section) => {
        switch (section._type) {
          case "comingUpSection": {
            const hidden = new Set<string>(
              (section.hiddenEventIds ?? []).map(String),
            );
            const rows = [
              ...(section.includeEvents === false
                ? []
                : occurrences.filter((o) => !hidden.has(o._id))
              ).map((o) => ({
                key: o.key,
                sort: o.at,
                when: shortWhen(o.at, o.allDay),
                what: o.title ?? "",
                where: o.location ?? "",
              })),
              ...(section.extraRows ?? []).map((row) => ({
                key: row._key,
                sort: "~",
                when: row.when ?? "",
                what: row.what ?? "",
                where: row.where ?? "",
              })),
            ].sort((a, b) => a.sort.localeCompare(b.sort));
            return (
              <section
                key={section._key}
                id={section._key}
                className="print-break"
              >
                <h2>{section.heading ?? "What's Coming Up?"}</h2>
                {rows.length ? (
                  <table className="mt-4 w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[var(--msl-sand)]">
                        <th
                          scope="col"
                          className="border border-[var(--msl-line)] p-2"
                        >
                          When
                        </th>
                        <th
                          scope="col"
                          className="border border-[var(--msl-line)] p-2"
                        >
                          What
                        </th>
                        <th
                          scope="col"
                          className="border border-[var(--msl-line)] p-2"
                        >
                          Where
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.key}>
                          <td className="border border-[var(--msl-line)] p-2 font-bold">
                            {row.when}
                          </td>
                          <td className="border border-[var(--msl-line)] p-2">
                            {row.what}
                          </td>
                          <td className="border border-[var(--msl-line)] p-2">
                            {row.where}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-3">No events listed yet for this month.</p>
                )}
              </section>
            );
          }
          case "storySection":
            return (
              <section
                key={section._key}
                id={section._key}
                className="print-break"
              >
                <h2>{section.heading}</h2>
                {section.article?.author || section.byline ? (
                  <p className="mt-1 italic">
                    By {section.article?.author ?? section.byline}
                  </p>
                ) : null}
                {section.image?.id ? (
                  <SanityImage
                    image={section.image}
                    width={imageWidth}
                    className="mt-4 h-auto max-w-full"
                    queryParams={{ q: print ? 60 : 75 }}
                  />
                ) : null}
                <div className="mt-4">
                  <RichText value={section.article?.body ?? section.body} />
                </div>
              </section>
            );
          case "flyerSection":
            return (
              <section key={section._key} id={section._key}>
                <h2>{section.heading}</h2>
                <div className="mt-4 flex flex-col gap-6">
                  {(section.pages ?? []).map((page) =>
                    page.id ? (
                      <SanityImage
                        key={page._key}
                        image={page}
                        width={imageWidth}
                        className="print-break mx-auto h-auto max-w-full border border-[var(--msl-line)]"
                        queryParams={{ q: print ? 60 : 75 }}
                      />
                    ) : null,
                  )}
                </div>
              </section>
            );
          case "funSection":
            return (
              <section
                key={section._key}
                id={section._key}
                className="print-break"
              >
                <h2>{section.heading}</h2>
                <div className="mt-4">
                  <RichText value={section.body} />
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
