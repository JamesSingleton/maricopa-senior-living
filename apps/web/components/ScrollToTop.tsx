"use client";

import { ArrowUp } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { Button } from "@maricopa-senior-living/ui/components/button";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        type="button"
        size="icon"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={clsx(
          "rounded-full shadow-lg transition-opacity",
          isVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </Button>
    </div>
  );
};

export default ScrollToTop;
