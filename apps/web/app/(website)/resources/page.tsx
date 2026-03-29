"use client";

import ResourceCard from "@/components/resources/resource-card";
import { FilterPanel } from "@/components/resources/resource-filter";
import { RESOURCES } from "@/lib/dummy-data";

const PAGE_SIZE = 10;

const onTagClick = (tag: string) => {
  console.log("Tag Clicked:", tag);
};

export default function ResourcesPage() {
  return (
    <>
      <section
        className="bg-primary py-14 px-4"
        aria-label="Resources page header"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-primary-foreground text-balance">
            Resource Directory
          </h1>
          <p className="font-sans text-primary-foreground/70 text-lg mt-2 max-w-2xl text-pretty">
            Locally verified services and programs for Maricopa seniors —
            organized into 10 categories for easy navigation.
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-sm font-sans">
            {[
              "10 Category Groups",
              "80+ Sub-Categories",
              `${RESOURCES.length}+ Verified Resources`,
            ].map((stat) => (
              <div
                key={stat}
                className="flex items-center gap-2 text-primary-foreground/80"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
                  aria-hidden="true"
                />
                {stat}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <aside className="hidden lg:block" aria-label="Filter resources">
            <div className="sticky top-32 bg-card border border-border rounded-xl p-5 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <p className="font-serif font-bold text-lg text-foreground mb-5">
                Filters
              </p>
              <FilterPanel />
            </div>
          </aside>
          <div>
            <section aria-label={`Resource results — page`}>
              <ol className="space-y-6 list-none">
                {RESOURCES.map((resource) => (
                  <li key={resource.id}>
                    <ResourceCard
                      resource={resource}
                      selectedTags={[]}
                      onTagClick={onTagClick}
                    />
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
