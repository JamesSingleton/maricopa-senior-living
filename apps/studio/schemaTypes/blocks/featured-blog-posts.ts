import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredBlogPosts = defineType({
  name: "featuredBlogPosts",
  title: "Featured Blog Posts",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "posts",
      title: "Blog Posts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "blog" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", posts: "posts" },
    prepare({ title, posts = [] }) {
      return {
        title: title || "Featured Blog Posts",
        subtitle: `Featured Blog Posts • ${posts.length} item${posts.length === 1 ? "" : "s"}`,
        media: DocumentTextIcon,
      };
    },
  },
});
