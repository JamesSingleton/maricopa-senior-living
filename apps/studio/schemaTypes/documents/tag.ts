import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { taxonomySlugField } from "../../utils/slug";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    taxonomySlugField("tag"),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "This will get displayed under the title on the tag page as well as the page's description (what shows up on Google Search Results).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlight",
      title: "Highlight",
      type: "boolean",
      description:
        "If checked, this tag will be highlighted on the right sidebar.",
      initialValue: false,
    }),
  ],
});
