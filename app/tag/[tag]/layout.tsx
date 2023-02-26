export default function TagLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tag: string }
}) {
  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-7xl">
        {params.tag.replace(/-/g, ' ').replace('and', '&')}
      </h1>
      <span className="mt-2 block text-neutral-700 sm:mt-4">5 Articles</span>
      {children}
    </>
  )
}
