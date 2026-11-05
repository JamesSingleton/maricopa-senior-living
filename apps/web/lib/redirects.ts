import { cachedSanity } from "@maricopa-senior-living/sanity/live";
import { queryRedirect } from "@maricopa-senior-living/sanity/queries";
import { notFound, permanentRedirect, redirect } from "next/navigation";

/**
 * For paths with no content: follow a Redirect document (old category,
 * tag and article URLs from the previous site), otherwise 404.
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  const { data } = await cachedSanity({
    query: queryRedirect,
    params: { source: path },
    perspective: "published",
    stega: false,
  });
  if (data?.destination && data.destination !== path) {
    if (data.permanent === false) redirect(data.destination);
    permanentRedirect(data.destination);
  }
  notFound();
}
