import { cachedSanityMetadata } from "@maricopa-senior-living/sanity/live";
import {
  querySettings,
  queryTopics,
} from "@maricopa-senior-living/sanity/queries";

import { baseUrl } from "@/lib/constants";

/**
 * /llms.txt: a plain-text map of the site for AI assistants (ChatGPT,
 * Claude, Perplexity), so they can point seniors at the right page. Built
 * from the same topics and settings as the site, so it never goes stale.
 */
export async function GET() {
  const [{ data: settings }, { data: topics }] = await Promise.all([
    cachedSanityMetadata({ query: querySettings, perspective: "published" }),
    cachedSanityMetadata({ query: queryTopics, perspective: "published" }),
  ]);
  const name = settings?.siteTitle ?? "Maricopa Senior Living";
  const lines = [
    `# ${name}`,
    "",
    `> ${settings?.mission ?? settings?.description ?? "A free directory of local resources, events and news for seniors and caregivers in Maricopa, Arizona."}`,
    "",
    `${settings?.nonprofitStatement ?? ""} Listings are checked by volunteers; confirm details with each organization.`.trim(),
    "",
    "## Find help by topic",
    ...(topics ?? [])
      .filter((topic) => topic.slug)
      .map(
        (topic) =>
          `- [${topic.title}](${baseUrl}/topics/${topic.slug}): ${topic.description ?? ""} (${topic.resourceCount} local organizations)`,
      ),
    "",
    "## Sections",
    `- [All resources](${baseUrl}/resources): organizations and services with phone numbers, hours and addresses`,
    `- [Events](${baseUrl}/events): upcoming classes, meals and activities, in Arizona time`,
    `- [What's New](${baseUrl}/whats-new): monthly local news for seniors`,
    `- [Newsletter](${baseUrl}/newsletter): the monthly newsletter, every issue`,
    `- [Articles](${baseUrl}/articles): original articles by local writers`,
    `- [Helpful links](${baseUrl}/links): trusted outside articles, summarized`,
    `- [About](${baseUrl}/about): who runs the site and how to donate`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
