import { Box, Card, Flex, Grid, Heading, Stack, Text } from "@sanity/ui";
import type { DashboardWidget } from "@sanity/dashboard";
import {
  BookOpen,
  FileText,
  MapPin,
  Newspaper,
  Shapes,
  Tag,
  Tags,
} from "lucide-react";

const contentTypes = [
  {
    title: "Resource",
    description:
      "A local program or service. Always include a phone number — most visitors call directly.",
    icon: MapPin,
    accent: "#2d6a4f",
  },
  {
    title: "Guide",
    description:
      "Evergreen how-to content that stays useful for months or years. Add steps for structured instructions.",
    icon: BookOpen,
    accent: "#40916c",
  },
  {
    title: "Article",
    description:
      "News, announcements, or republished pieces. Use guides for lasting reference content instead.",
    icon: Newspaper,
    accent: "#52b788",
  },
  {
    title: "Page",
    description:
      "Flexible landing pages built with blocks — About, campaigns, or one-off info pages.",
    icon: FileText,
    accent: "#74c69d",
  },
  {
    title: "Category",
    description:
      "Primary browse sections like Meals or Transportation. Each resource gets one category.",
    icon: Tag,
    accent: "#95d5b2",
  },
  {
    title: "Tag",
    description:
      "Cross-cutting labels like Medicare. Select existing tags — avoid creating duplicates.",
    icon: Tags,
    accent: "#b7e4c7",
  },
] as const;

function TypeCard({
  title,
  description,
  icon: Icon,
  accent,
}: (typeof contentTypes)[number]) {
  return (
    <Card
      padding={3}
      radius={3}
      shadow={1}
      style={{
        borderLeft: `4px solid ${accent}`,
        height: "100%",
      }}
    >
      <Flex align="flex-start" gap={3}>
        <Box
          padding={2}
          style={{
            backgroundColor: `${accent}22`,
            borderRadius: "8px",
            color: accent,
            display: "flex",
            flexShrink: 0,
          }}
        >
          <Icon size={20} strokeWidth={2} />
        </Box>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            {title}
          </Text>
          <Text size={1} muted style={{ lineHeight: 1.5 }}>
            {description}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}

function StudioOverviewWidget() {
  return (
    <Card padding={0} radius={3} shadow={2} style={{ overflow: "hidden" }}>
      <Box
        padding={4}
        style={{
          background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #40916c 100%)",
        }}
      >
        <Flex align="center" gap={3}>
          <Box
            padding={3}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "white",
              display: "flex",
            }}
          >
            <Shapes size={28} strokeWidth={1.75} />
          </Box>
          <Stack space={2}>
            <Heading size={2} style={{ color: "white" }}>
              Content guide
            </Heading>
            <Text size={1} style={{ color: "rgba(255,255,255,0.88)", maxWidth: "42rem" }}>
              What each type is for and where it shows up on the public site.
            </Text>
          </Stack>
        </Flex>
      </Box>

      <Box padding={4}>
        <Grid columns={[1, 1, 2, 2]} gap={3}>
          {contentTypes.map((type) => (
            <TypeCard key={type.title} {...type} />
          ))}
        </Grid>

        <Card
          marginTop={4}
          padding={3}
          radius={3}
          tone="transparent"
          border
          style={{ backgroundColor: "var(--card-muted-bg-color, #f6f6f6)" }}
        >
          <Flex gap={3} align="flex-start">
            <Text size={1} weight="semibold" style={{ whiteSpace: "nowrap" }}>
              Categories vs tags
            </Text>
            <Text size={1} muted style={{ lineHeight: 1.55 }}>
              Categories organize the site (Meals, Housing). Tags cross-cut subjects
              (Medicare, dementia). When unsure, pick a category first and only add tags
              that help people filter.
            </Text>
          </Flex>
        </Card>
      </Box>
    </Card>
  );
}

export const studioOverviewWidget: DashboardWidget = {
  name: "studio-overview",
  component: StudioOverviewWidget,
  layout: { width: "large" },
};
