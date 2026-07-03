export default function Loading() {
  return (
    <article aria-busy>
      <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
        <div className="space-y-4 px-6 py-8 sm:px-10">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="aspect-[4/3] animate-pulse rounded-md bg-muted" />
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </article>
  );
}
