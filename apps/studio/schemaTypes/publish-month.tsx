import { defineField, getPublishedId } from "sanity";

import { PublicUrl } from "../components/PublicUrl";
import { monthLabel } from "../lib/months";

/** "2026-11-14" → "2026-11" — the day doesn't matter, only the month. */
export const toMonthKey = (date?: string | null) =>
  date ? date.slice(0, 7) : undefined;

/**
 * Month picker for monthly documents (What's New, the newsletter): a date
 * field shown as "November 2026", one document per month, with the page's
 * full web address underneath to copy.
 */
export function publishMonthField({
  type,
  path,
  label,
}: {
  type: "monthlyUpdate" | "newsletterEdition";
  /** Website section, e.g. "/whats-new". */
  path: string;
  /** Used in messages, e.g. "What's New". */
  label: string;
}) {
  return defineField({
    name: "publishMonth",
    title: "Month",
    type: "date",
    description: "Pick any day in the month this is for.",
    options: { dateFormat: "MMMM YYYY" },
    components: {
      input: (props) => {
        const month = toMonthKey(props.value as string | undefined);
        return (
          <PublicUrl path={month ? `${path}/${month}` : null}>
            {props.renderDefault(props)}
          </PublicUrl>
        );
      },
    },
    validation: (rule) =>
      rule.required().custom(async (value, context) => {
        const month = toMonthKey(value as string | undefined);
        if (!month) return true;
        const id = getPublishedId(context.document?._id ?? "");
        const client = context.getClient({ apiVersion: "2025-02-19" });
        const taken = await client.fetch<boolean>(
          `defined(*[_type == $type && string::startsWith(publishMonth, $month) && !(_id in [$id, "drafts." + $id])][0]._id)`,
          { type, month, id },
        );
        return taken
          ? `There is already a ${label} for ${monthLabel(month)}. Open that one instead.`
          : true;
      }),
  });
}
