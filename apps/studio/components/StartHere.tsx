import { Box, Card, Flex, Grid, Heading, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";

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
    title: "Edit the home page",
    description: "Change what's shown on the front page.",
    intent: "edit",
    params: { id: "home", type: "home" },
  },
];

type Status = {
  needsReview: number;
  dueForChecking: number;
  eventsThisWeek: number;
  hasThisMonth: boolean;
};

/** Live numbers for the "How things stand" panel. */
const STATUS_QUERY = `{
  "needsReview": count(*[needsReview == true && !(_id in path("drafts.**"))]),
  "dueForChecking": count(*[_type == "resource" && !(_id in path("drafts.**")) && (!defined(lastVerified) || lastVerified < string::split(string(dateTime(now()) - 60*60*24*365), "T")[0])]),
  "eventsThisWeek": count(*[_type == "event" && !(_id in path("drafts.**")) && dateTime(start) >= dateTime(now()) && dateTime(start) < dateTime(now()) + 60*60*24*7]),
  "hasThisMonth": defined(*[_type == "monthlyUpdate" && string::startsWith(publishMonth, string::split(string(now()), "T")[0][0...7])][0]._id)
}`;

function useStatus() {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    client
      .fetch<Status>(STATUS_QUERY)
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [client]);
  return status;
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
        <Grid gridTemplateColumns={[1, 2]} gap={4}>
          {JOBS.map((job) => (
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
