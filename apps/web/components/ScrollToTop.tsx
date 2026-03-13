"use client";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-2 right-2">
      <button
        aria-label="Scroll to top"
        type="button"
        onClick={scrollToTop}
        className={clsx(
          isVisible ? "opacity-100" : "opacity-0",
          "inline-flex items-center rounded-full bg-indigo-600 p-3 text-white shadow-xs transition-opacity hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        )}
      >
        <ArrowUpIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ScrollToTop;
