export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

export const navigation = {
  categories: [
    {
      name: 'Aging in Place',
      homeFitGuide: [
        {
          name: 'How to order a hard copy',
          href: 'https://www.aarp.org/livable-communities/housing/info-2020/homefit-guide.html',
          external: true,
        },
        {
          name: 'Online Guide',
          href: 'https://www.aarp.org/livable-communities/housing/info-2020/homefit-guide-download.html',
          external: true,
        },
      ],
      safetyDevices: [
        {
          name: 'Alert devices',
          href: '#',
        },
        {
          name: 'Smoke Detectors',
          href: '#',
        },
        {
          name: 'Carbon Monoxide Detectors',
          href: '#',
        },
        {
          name: 'Cameras',
          href: '#',
        },
        {
          name: 'Home security',
          href: '#',
        },
        {
          name: 'Smart doorbells',
          href: '#',
        },
      ],
    },
    {
      name: 'More',
      maricopa: [
        {
          name: "What's New Maricopa",
          href: 'https://maricopa-az.maps.arcgis.com/apps/MapSeries/index.html?appid=f9f29a96be60434f9b3f05332b865ded',
          external: true,
        },
        {
          name: 'City Meeting Calendar',
          href: 'https://maricopa.legistar.com/Calendar.aspx',
          external: true,
        },
      ],
      inMaricopa: [
        { name: 'News', href: 'https://www.inmaricopa.com', external: true },
        { name: 'Senior Section', href: 'https://www.inmaricopa.com/seniors/', external: true },
      ],
      aarp: [
        {
          name: 'AARP Arizona',
          href: 'https://states.aarp.org/arizona/',
          external: true,
        },
        {
          name: 'National AARP',
          href: 'https://www.aarp.org',
          external: true,
        },
      ],
      resources: [
        {
          name: 'Pinal-Gila Council for Senior Citizens',
          href: 'https://www.pgcsc.org/',
          external: true,
        },
        {
          name: 'NCOA',
          href: 'https://www.ncoa.org/',
          external: true,
        },
        {
          name: 'NIH',
          href: 'https://www.nih.gov/',
          external: true,
        },
        {
          name: 'CDC',
          href: 'https://www.cdc.gov/',
          external: true,
        },
      ],
    },
  ],
  pages: [
    {
      name: 'Articles',
      href: '/articles',
    },
    {
      name: 'AZ Travel',
      href: '/category/arizona-travel',
    },
  ],
}
