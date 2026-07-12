"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  // Presentation Tool manages draft mode itself; only show for standalone preview.
  if (isPresentationTool) {
    return null;
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-50 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm"
    >
      Disable Draft Mode
    </a>
  );
}
