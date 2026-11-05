import { Card, Stack, Text } from "@sanity/ui";
import type { ObjectInputProps } from "sanity";

/**
 * Plain-language help shown at the top of a document form. It's a form
 * component, not a field, so it never ends up in the data or the types.
 */
export function withHowTo(lines: string[]) {
  return function HowToInput(props: ObjectInputProps) {
    return (
      <Stack gap={5}>
        <Card padding={4} radius={3} tone="primary" border>
          <Stack gap={3}>
            {lines.map((line) => (
              <Text key={line} size={2}>
                {line}
              </Text>
            ))}
          </Stack>
        </Card>
        {props.renderDefault(props)}
      </Stack>
    );
  };
}
