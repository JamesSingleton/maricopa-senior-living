export default function sitemap() {
  const routes = ['', '/az-travel'].map((route) => ({
    url: `https://maricopaseniorliving.org${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes]
}
