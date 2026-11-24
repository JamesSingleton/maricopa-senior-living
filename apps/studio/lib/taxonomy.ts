/**
 * Rules behind the "Topics" check-up screen. Kept apart from the React
 * component so the thresholds are easy to find and change.
 */

export type TopicRow = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  resources: number;
  links: number;
  articles: number;
  events: number;
};

export type SourceRow = { source: string; count: number };

export type Warning = { tone: "caution" | "critical"; text: string };

/** A topic page with more than this many places to call is a long scroll. */
export const MAX_RESOURCES = 45;
/** …and more than this many items altogether is hard to keep tidy. */
export const MAX_ITEMS = 180;
/** Fewer than this and the topic probably belongs inside another one. */
export const MIN_ITEMS = 8;
/** The home page shows every topic as a tile; past this it's a wall again. */
export const MAX_TOPICS = 16;

export const totalOf = (topic: TopicRow) =>
  topic.resources + topic.links + topic.articles + topic.events;

const STOP = new Set(["and", "the", "of", "for", "in", "to", "a"]);

const words = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    // "Caregivers" and "Caregiving" should count as the same word.
    .map((word) => word.replace(/(ing|ers|er|s)$/, ""))
    .filter((word) => word.length > 2 && !STOP.has(word));

/** Other topics that share a main word with this one. */
export function lookalikes(topic: TopicRow, all: TopicRow[]) {
  const mine = new Set(words(topic.title));
  return all.filter(
    (other) =>
      other._id !== topic._id && words(other.title).some((w) => mine.has(w)),
  );
}

export function topicWarnings(topic: TopicRow, all: TopicRow[]): Warning[] {
  const warnings: Warning[] = [];
  const total = totalOf(topic);
  if (topic.resources > MAX_RESOURCES || total > MAX_ITEMS) {
    warnings.push({
      tone: "caution",
      text: `Crowded: ${total} items (${topic.resources} places to call). Visitors have a lot to scroll through. Consider splitting it into two clearer topics, or moving items that fit better elsewhere.`,
    });
  }
  if (total < MIN_ITEMS) {
    warnings.push({
      tone: "caution",
      text: `Thin: only ${total} ${total === 1 ? "item" : "items"}. Consider folding it into a related topic so visitors have fewer tiles to choose from.`,
    });
  }
  const similar = lookalikes(topic, all);
  if (similar.length) {
    warnings.push({
      tone: "critical",
      text: `Sounds like “${similar.map((t) => t.title).join("”, “")}”. Two topics with similar names split the same items in two — consider combining them.`,
    });
  }
  return warnings;
}

/** "A.A.R.P.", "AARP.org" and "The AARP" are all the same publisher. */
export const sourceKey = (source: string) =>
  source
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\.(org|com|gov|net|edu)\b.*$/, "")
    .replace(/^the\s+/, "")
    .replace(/\b(inc|llc|co)\b\.?/g, "")
    .replace(/[^a-z0-9]+/g, "");

/** Publishers of helpful links that are spelled more than one way. */
export function sourceVariants(sources: SourceRow[]) {
  const groups = new Map<string, SourceRow[]>();
  for (const row of sources) {
    const key = sourceKey(row.source);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => group.sort((a, b) => b.count - a.count))
    .sort((a, b) => b.length - a.length);
}
