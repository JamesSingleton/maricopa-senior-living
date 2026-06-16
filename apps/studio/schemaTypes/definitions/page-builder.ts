import { defineArrayMember, defineField } from "sanity";

import { blocks } from "../blocks";

export const pageBuilderField = defineField({
  name: "pageBuilder",
  title: "Page Content",
  type: "array",
  of: blocks.map((block) => defineArrayMember({ type: block.name })),
  options: {
    insertMenu: {
      views: [{ name: "list" }],
    },
  },
});

export const pageBuilderType = defineField({
  name: "pageBuilder",
  title: "Page Builder",
  type: "array",
  of: blocks.map((block) => defineArrayMember({ type: block.name })),
});
