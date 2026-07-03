"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useTransition } from "react";

import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@maricopa-senior-living/ui/components/button";

import type { ResourceCardData } from "@/components/ResourceCard";

const parsers = {
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  page: parseAsInteger.withDefault(1),
};

export function ResourcesFilterBar({
  allCategories,
  allTags,
}: {
  allCategories: { slug: string; title: string }[];
  allTags: { slug: string; title: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(parsers, {
    shallow: true,
    startTransition,
  });

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">
        Filter resources {isPending ? "(updating…)" : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => {
          const active = filters.categories.includes(cat.slug);
          return (
            <Button
              key={cat.slug}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={() =>
                setFilters({
                  categories: active ? [] : [cat.slug],
                  page: 1,
                })
              }
            >
              {cat.title}
            </Button>
          );
        })}
      </div>
      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = filters.tags.includes(tag.slug);
            return (
              <Button
                key={tag.slug}
                type="button"
                size="sm"
                variant={active ? "secondary" : "ghost"}
                onClick={() =>
                  setFilters({
                    tags: active
                      ? filters.tags.filter((t) => t !== tag.slug)
                      : [...filters.tags, tag.slug],
                    page: 1,
                  })
                }
              >
                {tag.title}
              </Button>
            );
          })}
        </div>
      ) : null}
      {(filters.categories.length > 0 || filters.tags.length > 0) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFilters({ categories: [], tags: [], page: 1 })}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}

export function ResourcesGrid({ resources }: { resources: ResourceCardData[] }) {
  if (!resources.length) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        No resources match these filters. Try clearing filters or browse by
        category.
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {resources.map((resource) => (
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  );
}
