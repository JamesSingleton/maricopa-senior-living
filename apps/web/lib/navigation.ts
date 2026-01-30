import { sanityFetch } from '@maricopa-senior-living/sanity/live'
import { queryGlobalSeoSettings, queryNavbarData } from '@maricopa-senior-living/sanity/query'

export const getNavigationData = async () => {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({ query: queryNavbarData }),
    sanityFetch({ query: queryGlobalSeoSettings }),
  ])

  return { navbarData: navbarData.data, settingsData: settingsData.data }
}
