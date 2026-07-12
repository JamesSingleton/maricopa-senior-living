import { syncTagInvalidateEventHandler } from "@sanity/functions";

function normalizeSiteUrl(raw: string): string {
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `https://${raw.replace(/\/$/, "")}`;
}

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const syncTags = event.data.syncTags ?? [];
    const siteUrl = process.env.SITE_URL;
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    if (!siteUrl) {
      throw new Error("Missing SITE_URL for expire-tags endpoint");
    }
    if (!secret) {
      throw new Error("Missing SANITY_REVALIDATE_SECRET for expire-tags auth");
    }

    const response = await fetch(
      `${normalizeSiteUrl(siteUrl)}/api/expire-tags`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sanity-revalidate-secret": secret,
        },
        body: JSON.stringify({ syncTags }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `expire-tags failed (${response.status}): ${body || response.statusText}`,
      );
    }

    try {
      const doneResponse = await done(syncTags);
      console.log(
        `Invalidated ${syncTags.length} sync tags; Sanity done status ${doneResponse.status}`,
      );
    } catch (error) {
      console.error("Error invoking Sanity invalidation done endpoint", error);
      throw error;
    }
  },
);
