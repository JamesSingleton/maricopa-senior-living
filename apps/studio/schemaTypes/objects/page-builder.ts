import { defineArrayMember, defineField, defineType } from "sanity";

export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Page Builder",
  type: "array",
  of: [
    defineArrayMember({ type: "heroBlock" }),
    defineArrayMember({ type: "richTextSection" }),
    defineArrayMember({ type: "featuredResources" }),
    defineArrayMember({ type: "featuredCategories" }),
    defineArrayMember({ type: "featuredArticles" }),
    defineArrayMember({ type: "featuredGuides" }),
    defineArrayMember({ type: "resourceGrid" }),
    defineArrayMember({ type: "callToAction" }),
    defineArrayMember({ type: "faqBlock" }),
    defineArrayMember({ type: "splitImage" }),
    defineArrayMember({ type: "communityAlert" }),
  ],
});

export const pageBuilderField = defineField({
  name: "pageBuilder",
  title: "Page Sections",
  type: "pageBuilder",
  description: "Build the page by adding and reordering sections.",
});
