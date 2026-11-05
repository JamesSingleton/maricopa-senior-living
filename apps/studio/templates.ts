import type { InitialValueResolverContext, Template } from "sanity";

import { currentMonthKey, nextMonthKey } from "./lib/months";

type MonthlyDoc = { month?: string; intro?: string; body?: unknown[] };

/**
 * "Start next month": a new What's New that copies the latest month's
 * intro and text, so Ron edits a fresh document instead of the old one.
 */
export const startNextMonthTemplate: Template = {
  id: "monthlyUpdate-next",
  title: "What's New — start next month",
  schemaType: "monthlyUpdate",
  value: async (
    _params: unknown,
    { getClient }: InitialValueResolverContext,
  ) => {
    const client = getClient({ apiVersion: "2025-02-19" });
    const latest = await client.fetch<MonthlyDoc | null>(
      '*[_type == "monthlyUpdate" && !(_id in path("drafts.**"))] | order(month desc)[0]{month, intro, body}',
    );
    const thisMonth = currentMonthKey();
    // Next month after the latest one, but never a month in the past.
    const candidate = latest?.month ? nextMonthKey(latest.month) : thisMonth;
    const month = candidate < thisMonth ? thisMonth : candidate;
    return {
      month,
      intro: latest?.intro ?? "",
      body: latest?.body ?? [],
    };
  },
};

export const newsletterNextTemplate: Template = {
  id: "newsletterEdition-next",
  title: "Newsletter — start next month",
  schemaType: "newsletterEdition",
  value: async (
    _params: unknown,
    { getClient }: InitialValueResolverContext,
  ) => {
    const client = getClient({ apiVersion: "2025-02-19" });
    const latest = await client.fetch<{
      month?: string;
      sections?: unknown[];
    } | null>(
      '*[_type == "newsletterEdition" && !(_id in path("drafts.**"))] | order(month desc)[0]{month, "sections": sections[_type in ["comingUpSection", "funSection"]]{..., "_key": _key}}',
    );
    const thisMonth = currentMonthKey();
    const candidate = latest?.month ? nextMonthKey(latest.month) : thisMonth;
    const month = candidate < thisMonth ? thisMonth : candidate;
    return {
      month,
      // Keep the recurring layout (events table, fun page); stories and
      // flyers change every month.
      sections: latest?.sections?.length
        ? latest.sections
        : [
            {
              _type: "comingUpSection",
              _key: "coming-up",
              heading: "What's Coming Up?",
              includeEvents: true,
            },
          ],
    };
  },
};
