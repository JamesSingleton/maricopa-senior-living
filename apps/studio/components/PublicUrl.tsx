import { CopyIcon } from "@sanity/icons/Copy";
import { LaunchIcon } from "@sanity/icons/Launch";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useToast } from "@sanity/ui/toast";
import type { ReactNode } from "react";

/** The public website; override for staging with SANITY_STUDIO_SITE_URL. */
export const SITE_URL = (
  process.env.SANITY_STUDIO_SITE_URL ?? "https://www.maricopaseniorliving.org"
).replace(/\/+$/, "");

/**
 * Shows the full web address of the document with Copy and Open buttons,
 * so Ron can paste a link into an email without working it out himself.
 */
export function PublicUrl({
  path,
  children,
}: {
  path: string | null;
  children?: ReactNode;
}) {
  const toast = useToast();
  const url = path ? `${SITE_URL}${path}` : null;
  return (
    <Stack gap={3}>
      {children}
      <Card
        padding={3}
        radius={2}
        tone={url ? "positive" : "transparent"}
        border
      >
        {url ? (
          <Flex align="center" gap={2} wrap="wrap">
            <Text
              size={1}
              weight="medium"
              style={{ wordBreak: "break-all", flex: 1, minWidth: 200 }}
            >
              {url}
            </Text>
            <Button
              icon={CopyIcon}
              mode="ghost"
              text="Copy link"
              onClick={() => {
                navigator.clipboard
                  .writeText(url)
                  .then(() =>
                    toast.push({ status: "success", title: "Link copied" }),
                  )
                  .catch(() =>
                    toast.push({
                      status: "error",
                      title:
                        "Couldn't copy — select the address and copy it instead",
                    }),
                  );
              }}
            />
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              icon={LaunchIcon}
              mode="ghost"
              text="Open"
            />
          </Flex>
        ) : (
          <Text size={1} muted>
            The web address appears here once this is filled in. It works after
            you publish.
          </Text>
        )}
      </Card>
    </Stack>
  );
}
