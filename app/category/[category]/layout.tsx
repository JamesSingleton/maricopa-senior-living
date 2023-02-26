export default function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { category: string }
}) {
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-7xl">
        {params.category.replace(/-/g, ' ').replace('and', '&')}
      </h1>
      <span className="mt-2 block text-neutral-700 sm:mt-4">5 Articles</span>
      {children}
    </>
  )
}
