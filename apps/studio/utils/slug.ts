import {
  defineField,
  getDraftId,
  getPublishedId,
  type SlugifierFn,
  type SlugValidationContext,
} from "sanity";
import slugify from "slugify";

/** Slugs that would collide with the site's own sections. */
export const RESERVED_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "articles",
  "events",
  "find-help",
  "newsletter",
  "newsletters",
  "resources",
  "search",
  "topics",
  "whats-new",
  "links",
]);

export const createSlug: SlugifierFn = (input) =>
  slugify(input, { lower: true, remove: /[^a-zA-Z0-9 -]/g, trim: true });

/** Unique per document type, so a page and an article may share a slug. */
async function isUniqueForType(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2025-02-19" });
  const id = getPublishedId(document?._id ?? "");
  return client.fetch<boolean>(
    "!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)",
    { type: document?._type, draft: getDraftId(id), published: id, slug },
  );
}

/** Standard "URL" slug field, generated from the title. */
export function slugField({
  source = "title",
  reserved = false,
}: {
  source?: string;
  reserved?: boolean;
} = {}) {
  return defineField({
    name: "slug",
    title: "Web address",
    type: "slug",
    description:
      'The last part of this page\'s web address. Click "Generate" to make it from the title.',
    options: { source, slugify: createSlug, isUnique: isUniqueForType },
    validation: (rule) =>
      rule.required().custom((value) => {
        const current = value?.current ?? "";
        if (reserved && RESERVED_SLUGS.has(current)) {
          return `"${current}" is used by another part of the site. Please choose a different web address.`;
        }
        if (/[^a-z0-9-]/.test(current)) {
          return "Use only lowercase letters, numbers and dashes.";
        }
        return true;
      }),
  });
}
