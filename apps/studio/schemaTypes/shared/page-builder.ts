import { defineArrayMember, defineType } from "sanity";

export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Page builder",
  type: "array",
  of: [
    defineArrayMember({ type: "hero" }),
    defineArrayMember({ type: "richText" }),
    defineArrayMember({ type: "mediaText" }),
    defineArrayMember({ type: "callToAction" }),
    defineArrayMember({ type: "featureList" }),
    defineArrayMember({ type: "faq" }),
    defineArrayMember({ type: "video" }),
    defineArrayMember({ type: "disclaimer" }),
    defineArrayMember({ type: "alert" }),
    defineArrayMember({ type: "quickLinks" }),
    defineArrayMember({ type: "categoryBrowse" }),
    defineArrayMember({ type: "resourceHighlight" }),
    defineArrayMember({ type: "articleHighlight" }),
    defineArrayMember({ type: "steps" }),
    defineArrayMember({ type: "contactSection" }),
    defineArrayMember({ type: "location" }),
    defineArrayMember({ type: "testimonial" }),
    defineArrayMember({ type: "partners" }),
    defineArrayMember({ type: "stayConnected" }),
  ],
  options: {
    insertMenu: {
      views: [{ name: "grid" }, { name: "list" }],
    },
  },
});
