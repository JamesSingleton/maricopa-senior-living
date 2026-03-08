export function BlogHeader({
  title,
  description,
}: {
  title: string | null
  description: string | null
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-8">{description}</p>
      </div>
    </div>
  )
}
