export function FilterPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans font-bold text-sm text-foreground mb-2">
          Search
        </p>
      </div>
      <div>
        <p className="font-sans font-bold text-sm text-foreground mb-2">
          Category
        </p>
      </div>
      <div>
        <p className="font-sans font-bold text-sm text-foreground mb-2">
          Filter by Tag
        </p>
      </div>
    </div>
  );
}
