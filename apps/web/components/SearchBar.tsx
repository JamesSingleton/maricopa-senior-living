"use client";

import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

import { Button } from "@maricopa-senior-living/ui/components/button";

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q] = useQueryState("q");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (value) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <label htmlFor="search" className="text-sm font-medium text-foreground">
        Search the directory
      </label>
      <div className="mt-2 flex gap-2">
        <input
          ref={inputRef}
          id="search"
          name="search"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Meals, transportation, Medicare…"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
