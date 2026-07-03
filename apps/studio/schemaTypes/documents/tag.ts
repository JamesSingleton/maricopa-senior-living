import { TagsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { isUniqueSlug, isUniqueTitle } from "../../utils/validation";
import { seoField } from "../objects/seo";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagsIcon,
  description:
    "Secondary labels for filtering. Search before creating — keep to 30–50 tags. Tag pages only appear when 3+ resources use the tag.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().custom(isUniqueTitle),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return "Slug is required";
          const unique = await isUniqueSlug(slug.current, context);
          return unique || "Slug is already in use";
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description: "Optional intro shown at the top of the tag landing page.",
    }),
    defineField({
      name: "synonyms",
      title: "Synonyms",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Alternative names editors might search for (e.g. 'SNAP' for 'Food Stamps').",
    }),
    seoField,
  ],
  preview: {
    select: { title: "title", synonyms: "synonyms" },
    prepare({ title, synonyms }) {
      const syn = synonyms?.length ? `Also: ${synonyms.join(", ")}` : undefined;
      return { title, subtitle: syn };
    },
  },
});
