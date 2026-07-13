import { getDraftId, getPublishedId, type ValidationContext } from "sanity";

export type TaxonomyType = "category" | "tag";

export function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function getDocumentIds(context: ValidationContext) {
  const id = getPublishedId(context.document?._id ?? "");
  return {
    published: id,
    draft: getDraftId(id),
  };
}

/**
 * Ensures title is unique within the same document type (case-insensitive).
 */
export function uniqueTitleWithinType(type: TaxonomyType) {
  return async (title: string | undefined, context: ValidationContext) => {
    if (!title?.trim()) return true;

    const client = context.getClient({ apiVersion: "2025-02-10" });
    const { published, draft } = getDocumentIds(context);
    const normalized = normalizeTitle(title);

    const count = await client.fetch<number>(
      `count(*[_type == $type && lower(title) == $title && !(_id in [$draft, $published])])`,
      { type, title: normalized, draft, published },
    );

    if (count > 0) {
      return type === "category"
        ? "A category with this title already exists"
        : "A tag with this title already exists";
    }

    return true;
  };
}

/**
 * Ensures a category title doesn't collide with a tag title (and vice versa).
 */
export function uniqueTitleAcrossTaxonomy(otherType: TaxonomyType) {
  return async (title: string | undefined, context: ValidationContext) => {
    if (!title?.trim()) return true;

    const client = context.getClient({ apiVersion: "2025-02-10" });
    const normalized = normalizeTitle(title);

    const count = await client.fetch<number>(
      `count(*[_type == $type && lower(title) == $title])`,
      { type: otherType, title: normalized },
    );

    if (count > 0) {
      return otherType === "category"
        ? "A category already uses this title"
        : "A tag already uses this title";
    }

    return true;
  };
}
