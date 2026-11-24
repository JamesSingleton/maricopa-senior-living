import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { useClient, useCurrentUser } from "sanity";
import { IntentLink, useRouter } from "sanity/router";

import { isAdmin } from "../lib/access";
import {
  MAX_TOPICS,
  type SourceRow,
  sourceVariants,
  type TopicRow,
  topicWarnings,
  totalOf,
} from "../lib/taxonomy";

type Data = {
  topics: TopicRow[];
  untagged: { resource: number; helpfulLink: number; article: number };
  sources: string[];
};

const published = '!(_id in path("drafts.**"))';

const QUERY = `{
  "topics": *[_type == "topic" && ${published}] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    description,
    "resources": count(*[_type == "resource" && ${published} && references(^._id)]),
    "links": count(*[_type == "helpfulLink" && ${published} && references(^._id)]),
    "articles": count(*[_type == "article" && ${published} && references(^._id)]),
    "events": count(*[_type == "event" && ${published} && references(^._id)])
  },
  "untagged": {
    "resource": count(*[_type == "resource" && ${published} && count(topics) < 1]),
    "helpfulLink": count(*[_type == "helpfulLink" && ${published} && count(topics) < 1]),
    "article": count(*[_type == "article" && ${published} && count(topics) < 1])
  },
  "sources": *[_type == "helpfulLink" && ${published} && defined(source)].source
}`;

function useTaxonomy() {
  const client = useClient({ apiVersion: "2025-02-19" });
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    client
      .fetch<Data>(QUERY)
      .then(setData)
      .catch(() => setFailed(true));
  }, [client]);
  return { data, failed };
}

const KINDS = [
  { key: "resources", pane: "resources", label: "places to call" },
  { key: "links", pane: "links", label: "helpful links" },
  { key: "articles", pane: "articles", label: "articles" },
  { key: "events", pane: "events", label: "events" },
] as const;

/** Opens Content → Browse by topic → All topics → this topic → the list. */
function ListLink({
  topicId,
  pane,
  children,
}: {
  topicId: string;
  pane: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const href = `/structure/by-topic;all;${topicId};${pane}`;
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        router.navigateUrl({ path: href });
      }}
    >
      {children}
    </a>
  );
}

function TopicCard({
  topic,
  all,
  admin,
}: {
  topic: TopicRow;
  all: TopicRow[];
  admin: boolean;
}) {
  const warnings = topicWarnings(topic, all);
  return (
    <Card
      padding={4}
      radius={3}
      border
      tone={warnings.length ? "caution" : "default"}
    >
      <Stack gap={4}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Stack gap={2}>
            <Text size={3} weight="semibold">
              {topic.title}
            </Text>
            {topic.description ? (
              <Text size={1} muted>
                {topic.description}
              </Text>
            ) : null}
          </Stack>
          <Flex gap={2} align="center">
            <Badge tone={warnings.length ? "caution" : "positive"} fontSize={1}>
              {warnings.length ? "Worth a look" : "Looks good"}
            </Badge>
            <Badge fontSize={1}>{totalOf(topic)} items</Badge>
          </Flex>
        </Flex>
        <Text size={2}>
          {KINDS.map((kind, index) => (
            <span key={kind.key}>
              {index ? " · " : ""}
              <ListLink topicId={topic._id} pane={kind.pane}>
                {topic[kind.key]} {kind.label}
              </ListLink>
            </span>
          ))}
        </Text>
        {warnings.map((warning) => (
          <Card
            key={warning.text}
            padding={3}
            radius={2}
            tone={warning.tone}
            border
          >
            <Text size={2}>{warning.text}</Text>
          </Card>
        ))}
        {admin ? (
          <Text size={1}>
            <IntentLink intent="edit" params={{ id: topic._id, type: "topic" }}>
              Edit this topic's name and description
            </IntentLink>
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}

/**
 * "Topics" screen: find any topic quickly, see how full each one is, and
 * get a nudge before the list sprawls the way the old 81 categories and
 * 311 tags did.
 */
export function TopicsTool() {
  const { data, failed } = useTaxonomy();
  const admin = isAdmin(useCurrentUser());
  const [search, setSearch] = useState("");

  const sources = useMemo<SourceRow[]>(() => {
    const counts = new Map<string, number>();
    for (const source of data?.sources ?? []) {
      const name = source.trim();
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts].map(([source, count]) => ({ source, count }));
  }, [data]);
  const variants = useMemo(() => sourceVariants(sources), [sources]);

  if (failed) {
    return (
      <Box padding={5}>
        <Text>Couldn't load the topics. Reload the page to try again.</Text>
      </Box>
    );
  }
  if (!data) {
    return (
      <Box padding={5}>
        <Text muted>Counting…</Text>
      </Box>
    );
  }

  const needle = search.trim().toLowerCase();
  const topics = data.topics.filter(
    (topic) =>
      !needle ||
      topic.title.toLowerCase().includes(needle) ||
      (topic.description ?? "").toLowerCase().includes(needle),
  );
  const flagged = data.topics.filter(
    (topic) => topicWarnings(topic, data.topics).length,
  ).length;
  const untagged =
    data.untagged.resource + data.untagged.helpfulLink + data.untagged.article;

  return (
    <Box padding={[4, 5, 6]} style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading size={4}>Topics</Heading>
          <Text size={2} muted>
            Every resource, link, article and event sits under one of these
            topics. Visitors see them as the tiles on the home page, so a short,
            clear list is what makes things easy to find.
          </Text>
        </Stack>

        <Stack gap={3}>
          <Card
            padding={4}
            radius={3}
            border
            tone={data.topics.length > MAX_TOPICS ? "critical" : "positive"}
          >
            <Text size={2}>
              {data.topics.length > MAX_TOPICS
                ? `There are ${data.topics.length} topics. More than ${MAX_TOPICS} is too many tiles to scan — combine the thin or similar ones below before adding another.`
                : `${data.topics.length} topics — a good number. Keep it at ${MAX_TOPICS} or fewer.`}
            </Text>
          </Card>
          {flagged ? (
            <Card padding={4} radius={3} border tone="caution">
              <Text size={2}>
                {flagged} {flagged === 1 ? "topic is" : "topics are"} worth a
                look (marked below).
                {admin
                  ? ""
                  : " Ask James if a topic should be split or combined."}
              </Text>
            </Card>
          ) : null}
          {untagged ? (
            <Card padding={4} radius={3} border tone="caution">
              <Text size={2}>
                {untagged} published{" "}
                {untagged === 1 ? "item has" : "items have"} no topic, so
                visitors can only reach {untagged === 1 ? "it" : "them"} by
                searching: {data.untagged.resource} resources,{" "}
                {data.untagged.helpfulLink} helpful links,{" "}
                {data.untagged.article} articles. Find them in Content → Browse
                by topic → No topic yet.
              </Text>
            </Card>
          ) : null}
        </Stack>

        <TextInput
          fontSize={3}
          padding={4}
          placeholder="Find a topic, e.g. housing"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          aria-label="Find a topic"
        />

        <Stack gap={3}>
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              all={data.topics}
              admin={admin}
            />
          ))}
          {topics.length ? null : (
            <Text muted>No topic matches “{search}”.</Text>
          )}
        </Stack>

        {variants.length ? (
          <Stack gap={3}>
            <Heading size={2} as="h2">
              Publishers spelled more than one way
            </Heading>
            <Text size={2} muted>
              Helpful links are grouped by who published them. These look like
              the same publisher typed differently — pick one spelling (the most
              used is listed first) and fix the others.
            </Text>
            {variants.slice(0, 25).map((group) => (
              <Card key={group[0]?.source} padding={3} radius={2} border>
                <Text size={2}>
                  {group
                    .map((row) => `“${row.source}” (${row.count})`)
                    .join("  ·  ")}
                </Text>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
