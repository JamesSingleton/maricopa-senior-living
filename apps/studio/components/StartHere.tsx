import { Box, Card, Grid, Heading, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";

import { currentMonthKey } from "../lib/months";

type Job = {
  title: string;
  description: string;
  intent: "create" | "edit";
  params: Record<string, string>;
};

const JOBS: Job[] = [
  {
    title: "Start next month's What's New",
    description: "Copies last month so you can update it for the new month.",
    intent: "create",
    params: { type: "monthlyUpdate", template: "monthlyUpdate-next" },
  },
  {
    title: "Add an event",
    description:
      "Something happening on a date. It can repeat weekly or monthly.",
    intent: "create",
    params: { type: "event" },
  },
  {
    title: "Add a resource",
    description: "An organization or service people can call or visit.",
    intent: "create",
    params: { type: "resource" },
  },
  {
    title: "Add a helpful link",
    description: "A good article or website from somewhere else.",
    intent: "create",
    params: { type: "helpfulLink" },
  },
  {
    title: "Write an article",
    description: "Something you or another local writer wrote.",
    intent: "create",
    params: { type: "article" },
  },
  {
    title: "Start next month's newsletter",
    description: "Keeping you informed…still — keeps last month's layout.",
    intent: "create",
    params: { type: "newsletterEdition", template: "newsletterEdition-next" },
  },
  {
    title: "Add a page",
    description: "A blank page you build from sections: text, pictures, lists.",
    intent: "create",
    params: { type: "page" },
  },
  {
    title: "Edit the home page",
    description: "Change what's shown on the front page.",
    intent: "edit",
    params: { id: "home", type: "home" },
  },
];

/** Nonprofit pages that start filled in with the right sections. */
const NONPROFIT_JOBS: Job[] = [
  {
    title: "Donate page",
    description:
      "Donate button, how to give by check, EIN and what gifts pay for.",
    intent: "create",
    params: { type: "page", template: "page-donate" },
  },
  {
    title: "Volunteer page",
    description: "Ways to help, common questions and how to get in touch.",
    intent: "create",
    params: { type: "page", template: "page-volunteer" },
  },
  {
    title: "Board & documents page",
    description: "Board members, the IRS letter and Form 990s, supporters.",
    intent: "create",
    params: { type: "page", template: "page-board" },
  },
];

type Status = {
  needsReview: number;
  dueForChecking: number;
  eventsThisWeek: number;
  hasThisMonth: boolean;
  noTopic: number;
  hasEin: boolean;
};

/** Live numbers for the "How things stand" panel. */
const STATUS_QUERY = `{
  "needsReview": count(*[needsReview == true && !(_id in path("drafts.**"))]),
  "dueForChecking": count(*[_type == "resource" && !(_id in path("drafts.**")) && (!defined(lastVerified) || lastVerified < string::split(string(dateTime(now()) - 60*60*24*365), "T")[0])]),
  "eventsThisWeek": count(*[_type == "event" && !(_id in path("drafts.**")) && dateTime(start) >= dateTime(now()) && dateTime(start) < dateTime(now()) + 60*60*24*7]),
  "noTopic": count(*[_type in ["resource", "helpfulLink", "article"] && !(_id in path("drafts.**")) && count(topics) < 1]),
  "hasEin": defined(*[_id == "settings"][0].ein),
  "hasThisMonth": defined(*[_type == "monthlyUpdate" && !(_id in path("drafts.**")) && publishMonth == $monthStart][0]._id)
}`;

function useStatus() {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    client
      .fetch<Status>(STATUS_QUERY, { monthStart: `${currentMonthKey()}-01` })
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [client]);
  return status;
}

function JobGrid({ jobs }: { jobs: Job[] }) {
  return (
    <Grid gridTemplateColumns={[1, 2]} gap={4}>
      {jobs.map((job) => (
        <IntentLink
          key={job.title}
          intent={job.intent}
          params={job.params}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            padding={5}
            radius={3}
            shadow={1}
            tone="default"
            style={{ height: "100%" }}
          >
            <Stack gap={3}>
              <Text size={3} weight="semibold">
                {job.title}
              </Text>
              <Text size={2} muted>
                {job.description}
              </Text>
            </Stack>
          </Card>
        </IntentLink>
      ))}
    </Grid>
  );
}

function StatusItem({
  tone,
  children,
}: {
  tone: "positive" | "caution" | "default";
  children: React.ReactNode;
}) {
  return (
    <Card padding={4} radius={3} tone={tone} border>
      <Text size={2}>{children}</Text>
    </Card>
  );
}

/** Ron's landing screen: big buttons for the jobs he does every month. */
export function StartHere() {
  const status = useStatus();
  return (
    <Box padding={[4, 5, 6]} style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading size={4}>What would you like to do?</Heading>
          <Text size={2} muted>
            Click a box to start. Nothing goes on the website until you press
            “Publish”.
          </Text>
        </Stack>
        <JobGrid jobs={JOBS} />
        <Stack gap={3}>
          <Heading size={2} as="h2">
            Pages for the nonprofit
          </Heading>
          <Text size={2} muted>
            These start with the right sections already in place — fill in the
            words and press Publish. Then ask James to add the page to the menu.
          </Text>
        </Stack>
        <JobGrid jobs={NONPROFIT_JOBS} />
        {status ? (
          <Stack gap={3}>
            <Heading size={2} as="h2">
              How things stand
            </Heading>
            <StatusItem tone={status.hasThisMonth ? "positive" : "caution"}>
              {status.hasThisMonth
                ? "This month's What's New is published."
                : "This month's What's New hasn't been started yet — use “Start next month's What's New”."}
            </StatusItem>
            <StatusItem tone="default">
              {status.eventsThisWeek === 1
                ? "1 event is coming up in the next 7 days."
                : `${status.eventsThisWeek} events are coming up in the next 7 days.`}
            </StatusItem>
            {status.needsReview ? (
              <StatusItem tone="caution">
                {status.needsReview} items brought over from the old website
                still need a quick check. Find them under “Needs review” in
                Content.
              </StatusItem>
            ) : null}
            {status.noTopic ? (
              <StatusItem tone="caution">
                {status.noTopic} published items have no topic, so visitors can
                only find them by searching. See “Browse by topic → No topic
                yet” in Content, or the Topics screen.
              </StatusItem>
            ) : null}
            {status.hasEin ? null : (
              <StatusItem tone="caution">
                The EIN (tax ID) isn't filled in yet. Donors look for it — James
                can add it in Site settings → Nonprofit & donations.
              </StatusItem>
            )}
            {status.dueForChecking ? (
              <StatusItem tone="caution">
                {status.dueForChecking} resources haven't been checked in over a
                year. Find them under “Due for checking” in Content — call or
                visit their website, fix anything that changed, and set “Last
                checked”.
              </StatusItem>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
