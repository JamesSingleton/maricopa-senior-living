"use client";

import { Button } from "@maricopa-senior-living/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const VISITED_KEY = "msl:visited-pages";

function hasEarlierPageOnThisSite() {
  try {
    return Number(sessionStorage.getItem(VISITED_KEY) ?? "0") > 1;
  } catch {
    return false;
  }
}

/**
 * Counts pages viewed in this tab. Rendered once in the layout so
 * `BackButton` knows whether "back" stays on the site.
 */
export function PageVisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const count = Number(sessionStorage.getItem(VISITED_KEY) ?? "0");
      sessionStorage.setItem(VISITED_KEY, String(count + 1));
    } catch {
      // Storage can be blocked; BackButton then falls back to the home page.
    }
  }, [pathname]);
  return null;
}

/**
 * Goes back when the previous page was on this site; otherwise (arriving
 * from Google or a shared link) goes to the home page instead of leaving.
 */
export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() =>
        hasEarlierPageOnThisSite() ? router.back() : router.push("/")
      }
      className="h-11 px-4 text-base"
    >
      <ArrowLeft data-icon="inline-start" aria-hidden="true" />
      Go back
    </Button>
  );
}
