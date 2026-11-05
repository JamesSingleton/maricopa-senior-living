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

function useNeedsReviewCount() {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    client
      .fetch<number>(
        "count(*[needsReview == true && !(_id in path('drafts.**'))])",
      )
      .then(setCount)
      .catch(() => setCount(null));
  }, [client]);
  return count;
}

/** Ron's landing screen: big buttons for the jobs he does every month. */
export function StartHere() {
  const needsReview = useNeedsReviewCount();
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
        {needsReview ? (
          <Card padding={4} radius={3} tone="caution" border>
            <Flex gap={3} align="center">
              <Text size={2}>
                {needsReview} items brought over from the old website still need
                a quick check. Find them under “Needs review” in Content.
              </Text>
            </Flex>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
}
