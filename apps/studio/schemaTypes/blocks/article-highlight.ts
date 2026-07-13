import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";

export const articleHighlight = defineType({
  name: "articleHighlight",
  title: "Article highlight",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Latest articles",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "articles",
      title: "Articles",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "headline", articles: "articles" },
    prepare({ title, articles }) {
      const count = Array.isArray(articles) ? articles.length : 0;
      return {
        title: title || "Latest articles",
        subtitle: `Article highlight · ${count} article${count === 1 ? "" : "s"}`,
        media: DocumentTextIcon,
      };
    },
  },
});
