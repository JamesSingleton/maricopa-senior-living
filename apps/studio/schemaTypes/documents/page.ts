import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isReservedPageSlug, isUniqueSlug } from "../../utils/validation";
import { pageBuilderField } from "../objects/page-builder";
import { seoField } from "../objects/seo";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  description: "Flexible content pages built with the page builder (e.g. About, Contact).",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule
          .required()
          .custom(async (slug, context) => {
            if (!slug?.current) return "Slug is required";
            if (isReservedPageSlug(slug.current)) {
              return `"${slug.current}" is a reserved path — choose a different slug`;
            }
            const unique = await isUniqueSlug(slug.current, context);
            return unique || "Slug is already in use";
          }),
    }),
    pageBuilderField,
    seoField,
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `/${slug}` : undefined };
    },
  },
});
