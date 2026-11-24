import {
  defineArrayMember,
  defineField,
  getPublishedId,
  type ValidationContext,
} from "sanity";

/**
 * Warning (not an error) when another document of the same type already has
 * this value — catches the duplicate resources and links that piled up.
 */
export function warnIfDuplicate(field: "title" | "website" | "url") {
  return async (value: unknown, context: ValidationContext) => {
    if (typeof value !== "string" || value.trim().length < 3) return true;
    const id = getPublishedId(context.document?._id ?? "");
    const client = context.getClient({ apiVersion: "2025-02-19" });
    // For web addresses, treat http/https, "www." and a trailing slash as
    // the same site.
    const bare = value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/+$/, "");
    const variants =
      field === "title"
        ? [value.trim().toLowerCase()]
        : ["http://", "https://"].flatMap((scheme) =>
            ["", "www."].flatMap((www) =>
              ["", "/"].map((slash) => `${scheme}${www}${bare}${slash}`),
            ),
          );
    const match = await client.fetch<{ title?: string } | null>(
      `*[_type == $type && !(_id in [$id, "drafts." + $id]) && lower(${field}) in $variants][0]{title}`,
      { type: context.document?._type, id, variants },
    );
    return match
      ? `This looks like a duplicate of "${match.title}". Check that one first — you may want to update it instead.`
      : true;
  };
}

/** Topics picker shared by resources, links, articles and events. */
export function topicsField({ min = 1, max = 3 } = {}) {
  return defineField({
    name: "topics",
    type: "array",
    description: `Pick ${min === max ? max : `${min}–${max}`} topics people would look under. Topics are a fixed list; ask James if one is missing.`,
    of: [defineArrayMember({ type: "reference", to: [{ type: "topic" }] })],
    options: { layout: "tags" },
    validation: (rule) =>
      rule
        .min(min)
        .max(max)
        .unique()
        .error(`Choose between ${min} and ${max} topics.`),
  });
}

/** Flag for migrated content Ron should look over. */
export const needsReviewField = defineField({
  name: "needsReview",
  title: "Needs review",
  type: "boolean",
  description:
    "Ticked for items brought over from the old website. Read it over, fix anything that's wrong, then untick.",
  initialValue: false,
});

/** Short summary used on cards and in search results. */
export function summaryField({ required = true, max = 300 } = {}) {
  return defineField({
    name: "summary",
    type: "text",
    rows: 3,
    description: `One or two sentences in your own words (up to ${max} characters). Shown in lists and search results.`,
    validation: (rule) => (required ? rule.required().max(max) : rule.max(max)),
  });
}
