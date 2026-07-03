export default function Loading() {
  return (
    <article aria-busy>
      <div className="h-8 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="prose prose-lg prose-indigo mt-4 rounded-md bg-white shadow-sm lg:max-w-none">
        <div className="space-y-4 px-4 py-4 sm:px-10 sm:py-10">
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="aspect-[4/3] animate-pulse rounded-md bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
