import { env } from '@maricopa-senior-living/env/client'

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  }

  if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return env.NEXT_PUBLIC_VERCEL_URL
  }

  return 'http://localhost:3000'
}
