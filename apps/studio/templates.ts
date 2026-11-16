import type { InitialValueResolverContext, Template } from "sanity";

import { currentMonthKey, nextMonthKey } from "./lib/months";

type MonthlyDoc = { month?: string; intro?: string; body?: unknown[] };

const firstOfMonth = (month: string) => `${month}-01`;

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
      '*[_type == "monthlyUpdate" && !(_id in path("drafts.**"))] | order(publishMonth desc)[0]{"month": string::split(publishMonth, "-")[0] + "-" + string::split(publishMonth, "-")[1], intro, body}',
    );
    const thisMonth = currentMonthKey();
    // Next month after the latest one, but never a month in the past.
    const candidate = latest?.month ? nextMonthKey(latest.month) : thisMonth;
    const month = candidate < thisMonth ? thisMonth : candidate;
    return {
      publishMonth: firstOfMonth(month),
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
      '*[_type == "newsletterEdition" && !(_id in path("drafts.**"))] | order(publishMonth desc)[0]{"month": string::split(publishMonth, "-")[0] + "-" + string::split(publishMonth, "-")[1], "sections": sections[_type in ["comingUpSection", "funSection"]]{..., "_key": _key}}',
    );
    const thisMonth = currentMonthKey();
    const candidate = latest?.month ? nextMonthKey(latest.month) : thisMonth;
    const month = candidate < thisMonth ? thisMonth : candidate;
    return {
      publishMonth: firstOfMonth(month),
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

const key = () => Math.random().toString(36).slice(2, 12);

const paragraph = (text: string) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const text = (heading: string, body: string) => ({
  _type: "textBlock",
  _key: key(),
  heading,
  body: [paragraph(body)],
});

/**
 * Ready-made pages. Each starts with the right sections and placeholder
 * wording, so a new page is a matter of filling in, not building.
 */
const PAGE_STARTERS: {
  id: string;
  title: string;
  value: () => Record<string, unknown>;
}[] = [
  {
    id: "page-donate",
    title: "Page — Donate",
    value: () => ({
      title: "Donate",
      description:
        "Support Maricopa Senior Living, a volunteer-run 501(c)(3) nonprofit that keeps this guide free for seniors and caregivers.",
      sections: [
        {
          _type: "donateBlock",
          _key: key(),
          heading: "Support Maricopa Senior Living",
          text: "We are volunteers. Your gift pays for this website and the monthly newsletter, and keeps both free for everyone.",
          showDetails: true,
        },
        { _type: "impactBlock", _key: key(), showSiteNumbers: true },
        text(
          "Where your gift goes",
          "Replace this with two or three sentences about what donations pay for.",
        ),
        { _type: "contactBlock", _key: key(), useSiteContact: true },
      ],
    }),
  },
  {
    id: "page-volunteer",
    title: "Page — Volunteer",
    value: () => ({
      title: "Volunteer",
      description:
        "Ways to help Maricopa Senior Living: share an event, check a listing, write an article or help at an event.",
      sections: [
        text(
          "Ways to help",
          "Replace this with the jobs volunteers can do and how much time each takes.",
        ),
        {
          _type: "faqBlock",
          _key: key(),
          heading: "Questions about volunteering",
          items: [],
        },
        {
          _type: "contactBlock",
          _key: key(),
          heading: "Tell us you'd like to help",
          useSiteContact: true,
        },
      ],
    }),
  },
  {
    id: "page-board",
    title: "Page — Board & documents",
    value: () => ({
      title: "Our board and documents",
      description:
        "Who runs Maricopa Senior Living, and the public documents that show how the nonprofit is run.",
      sections: [
        {
          _type: "peopleBlock",
          _key: key(),
          heading: "Board of directors",
          people: [],
        },
        {
          _type: "documentsBlock",
          _key: key(),
          heading: "Public documents",
          intro:
            "Our IRS determination letter and yearly filings are free to download.",
          documents: [],
        },
        {
          _type: "supportersBlock",
          _key: key(),
          heading: "Supporters and partners",
          supporters: [],
        },
      ],
    }),
  },
];

export const pageTemplates: Template[] = PAGE_STARTERS.map((starter) => ({
  id: starter.id,
  title: starter.title,
  schemaType: "page",
  value: starter.value,
}));
