import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueSlug, isUniqueTitle } from "../../utils/validation";
import { seoField } from "../objects/seo";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  description:
    "Primary navigation buckets for resources (e.g. Healthcare, Transportation). Keep to 15–25 categories.",
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
      description: "Intro copy shown at the top of the category landing page.",
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "Optional. Only use when this is a sub-section of a broader category. " +
        "Example: set parent to “Health & Wellness” for a child category “Home Health Care” — " +
        "each still has its own page (/category/home-health-care). Leave blank for top-level " +
        "categories like Meals or Transportation.",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Show in featured category blocks on the homepage and sidebar.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    seoField,
  ],
  orderings: [{ title: "Title", name: "title", by: [{ field: "title", direction: "asc" }] }],
  preview: {
    select: { title: "title", parent: "parent.title", media: "image" },
    prepare({ title, parent, media }) {
      return {
        title,
        subtitle: parent ? `Under ${parent}` : "Top-level category",
        media,
      };
    },
  },
});
