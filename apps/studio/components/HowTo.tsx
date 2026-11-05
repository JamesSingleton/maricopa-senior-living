import { Card, Stack, Text } from "@sanity/ui";

/**
 * A plain-language help box shown at the top of a form. It stores nothing:
 * it's rendered in place of a hidden, never-filled string field.
 */
export function howToField(name: string, lines: string[]) {
  return {
    name,
    title: "How to",
    type: "string" as const,
    readOnly: true,
    components: {
      field: () => (
        <Card padding={4} radius={3} tone="primary" border>
          <Stack space={3}>
            {lines.map((line) => (
              <Text key={line} size={2}>
                {line}
              </Text>
            ))}
          </Stack>
        </Card>
      ),
    },
  };
}
