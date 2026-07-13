import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo, or other public video URL.",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Video",
        subtitle: subtitle ? `Video · ${subtitle}` : "Video",
        media: PlayIcon,
      };
    },
  },
});
