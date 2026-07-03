import {
  getDraftId,
  getPublishedId,
  type SlugValidationContext,
  type ValidationContext,
} from "sanity";

const RESERVED_PAGE_SLUGS = new Set([
  "category",
  "categories",
  "tags",
  "tag",
  "resources",
  "resource",
  "articles",
  "article",
  "guides",
  "guide",
  "search",
  "admin",
  "api",
]);

export async function isUniqueSlug(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2025-02-10" });
  const id = getPublishedId(document?._id ?? "");
  const draftId = getDraftId(id);
  const result = await client.fetch(
    `*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id`,
    { draft: draftId, published: id, slug },
  );
  return !result;
}

export async function isUniqueTitle(
  title: string,
  context: ValidationContext,
): Promise<boolean | string> {
  if (!title?.trim()) return true;
  const { document, getClient } = context;
  const type = document?._type;
  if (!type || !["category", "tag"].includes(type)) return true;

  const client = getClient({ apiVersion: "2025-02-10" });
  const id = getPublishedId(document?._id ?? "");
  const draftId = getDraftId(id);
  const normalized = title.toLowerCase().trim();
  const existing = await client.fetch(
    `count(*[_type == $type && !(_id in [$draft, $published]) && lower(trim(title)) == $normalized])`,
    { type, draft: draftId, published: id, normalized },
  );
  return existing === 0 || "A category or tag with this title already exists. Search existing terms first or see the Editor Handbook.";
}

export function isReservedPageSlug(slug: string): boolean {
  return RESERVED_PAGE_SLUGS.has(slug.toLowerCase());
}
