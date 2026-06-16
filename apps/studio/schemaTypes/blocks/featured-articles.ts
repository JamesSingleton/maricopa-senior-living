import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredArticles = defineType({
  name: "featuredArticles",
  title: "Featured Articles",
  type: "object",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "articles",
      title: "Articles",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", articles: "articles" },
    prepare({ title, articles = [] }) {
      return {
        title: title || "Featured Articles",
        subtitle: `Featured Articles • ${articles.length} item${articles.length === 1 ? "" : "s"}`,
        media: DocumentsIcon,
      };
    },
  },
});
