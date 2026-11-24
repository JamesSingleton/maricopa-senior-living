import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { draftMode } from "next/headers";
import { type ReactNode, Suspense } from "react";

type Render = (options: DynamicFetchOptions) => Promise<ReactNode> | ReactNode;

/**
 * The Page / Dynamic / Cached split in one place: published visitors get a
 * prerendered page; draft mode (Studio preview) streams inside Suspense with
 * the editor's perspective and click-to-edit overlays.
 */
export async function draftAware(
  render: Render,
  fallback: ReactNode = <Loading />,
) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return render({ perspective: "published", stega: false });
  return (
    <Suspense fallback={fallback}>
      <DraftRender render={render} />
    </Suspense>
  );
}

async function DraftRender({ render }: { render: Render }) {
  return render(await getDynamicFetchOptions());
}

export function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true">
      <p className="text-lg">Loading…</p>
    </div>
  );
}
