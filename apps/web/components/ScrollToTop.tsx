"use client";

import { Button } from "@maricopa-senior-living/ui/components/button";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Button
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={cn(
          "h-12 gap-2 rounded-full px-5 text-base shadow-md ring-1 ring-foreground/10 transition-opacity [&_svg]:size-5",
          isVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ArrowUp data-icon="inline-start" aria-hidden="true" />
        Top
      </Button>
    </div>
  );
};

export default ScrollToTop;
