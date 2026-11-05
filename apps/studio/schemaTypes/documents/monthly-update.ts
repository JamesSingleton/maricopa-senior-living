import { BellIcon } from "@sanity/icons/Bell";
import { defineField, defineType } from "sanity";

import { howToField } from "../../components/HowTo";
import { isAdmin } from "../../lib/access";
import { currentMonthKey, monthLabel } from "../../lib/months";
import { publishMonthField, toMonthKey } from "../publish-month";

/**
 * "What's New in Maricopa" — one document per month, written by hand.
 * Past months are locked for Ron so the archive answers "what was happening
 * in August 2026?" instead of being overwritten every month.
 */
export const monthlyUpdate = defineType({
  name: "monthlyUpdate",
  title: "What's New (monthly)",
  type: "document",
  icon: BellIcon,
  readOnly: ({ document, currentUser }) => {
    if (isAdmin(currentUser)) return false;
    const month = toMonthKey(
      (document as { publishMonth?: string } | undefined)?.publishMonth,
    );
    return Boolean(month && month < currentMonthKey());
  },
  fields: [
    howToField("howTo", [
      "Each month gets its own What's New. Use “Start next month” on the Studio home screen — it copies last month so you can update it.",
      "Earlier months are kept as an archive and can't be changed. Ask James if something in an old month needs fixing.",
    ]),
    publishMonthField({
      type: "monthlyUpdate",
      path: "/whats-new",
      label: "What's New",
    }),
    defineField({
      name: "title",
      type: "string",
      description:
        "Leave empty to use “What's New in Maricopa — [Month Year]”.",
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      description: "A short welcome shown at the top and on the home page.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "body",
      title: "This month",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest month first",
      name: "monthDesc",
      by: [{ field: "publishMonth", direction: "desc" }],
    },
  ],
  preview: {
    select: { date: "publishMonth", title: "title" },
    prepare: ({ date, title }) => {
      const month = toMonthKey(date) ?? "";
      return {
        title: title || `What's New — ${monthLabel(month)}`,
        subtitle:
          month === currentMonthKey()
            ? "This month"
            : month < currentMonthKey()
              ? "Archived"
              : "Upcoming",
      };
    },
  },
});
