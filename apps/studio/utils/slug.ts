import {
  defineField,
  type FieldDefinition,
  getDraftId,
  getPublishedId,
  type SlugifierFn,
  type SlugValidationContext,
} from "sanity";
import slugify from "slugify";

import type { PathnameParams } from "./types";

const TAXONOMY_TYPES = ["category", "tag"] as const;

export type SlugConflict = {
  _type: string;
  title: string;
};

export function defineSlug(
  schema: PathnameParams = { name: "slug" },
): FieldDefinition<"slug"> {
  const slugOptions = schema?.options;

  return defineField({
    ...schema,
    name: schema.name ?? "slug",
    title: schema?.title ?? "URL",
    type: "slug",
    components: {
      ...schema.components,
    },
    options: {
      ...(slugOptions ?? {}),
      isUnique: slugOptions?.isUnique ?? isUnique,
    },
  });
}

export async function isUnique(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const conflict = await findSlugConflict(slug, context);
  return conflict === null;
}

export async function isUniqueWithinType(
  slug: string,
  context: SlugValidationContext,
  documentType: string,
): Promise<boolean> {
  const conflict = await findSlugConflict(slug, context, {
    types: [documentType],
  });
  return conflict === null;
}

type FindSlugConflictOptions = {
  types?: string[];
};

export async function findSlugConflict(
  slug: string,
  context: SlugValidationContext,
  options: FindSlugConflictOptions = {},
): Promise<SlugConflict | null> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2025-02-10" });
  const id = getPublishedId(document?._id ?? "");
  const draftId = getDraftId(id);
  const types = options.types ?? TAXONOMY_TYPES;

  const query = `*[
    !(_id in [$draft, $published])
    && slug.current == $slug
    && _type in $types
  ][0]{ _type, title }`;

  return client.fetch<SlugConflict | null>(query, {
    draft: draftId,
    published: id,
    slug,
    types,
  });
}

const taxonomyTypeLabel: Record<string, string> = {
  category: "category",
  tag: "tag",
};

export async function validateTaxonomySlug(
  value: { current?: string } | undefined,
  context: SlugValidationContext,
  documentType: "category" | "tag",
): Promise<string | true> {
  const slug = value?.current;
  if (!slug) return true;

  const sameTypeConflict = await findSlugConflict(slug, context, {
    types: [documentType],
  });

  if (sameTypeConflict) {
    return `A ${taxonomyTypeLabel[documentType]} called "${sameTypeConflict.title}" already uses this web address. Please change the title or edit the web address below.`;
  }

  const otherType = documentType === "category" ? "tag" : "category";
  const crossTypeConflict = await findSlugConflict(slug, context, {
    types: [otherType],
  });

  if (crossTypeConflict) {
    return `A ${taxonomyTypeLabel[otherType]} called "${crossTypeConflict.title}" already uses this web address. Categories and tags must each have a unique address.`;
  }

  return true;
}

export const getDocTypePrefix = (type: string) => {
  if (["page"].includes(type)) return "";
  return type;
};

export const createSlug: SlugifierFn = (input) => {
  return slugify(input, {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
    trim: true,
  });
};

export const taxonomySlugField = (documentType: "category" | "tag") =>
  defineField({
    name: "slug",
    title: "Web Address",
    type: "slug",
    description:
      "This is the last part of the link people see. It's usually created automatically from the title — only change it if you know what you're doing.",
    options: {
      source: "title",
      slugify: createSlug,
      maxLength: 96,
      isUnique: (slug, context) =>
        isUniqueWithinType(slug, context, documentType),
    },
    validation: (rule) => [
      rule.required(),
      rule.custom(async (value, context) => {
        const slugContext = context as unknown as SlugValidationContext;
        return validateTaxonomySlug(
          value as { current?: string },
          slugContext,
          documentType,
        );
      }),
    ],
  });
