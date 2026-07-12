export const useCdn = process.env.NODE_ENV === "production";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-06-21";

/** Shared secret for `/api/expire-tags` (and legacy webhook configs). */
export const webhookSecret =
  process.env.SANITY_REVALIDATE_SECRET ?? process.env.SANITY_WEBHOOK_SECRET;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
