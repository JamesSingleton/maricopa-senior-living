import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, webhookSecret } from '@/lib/sanity.api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: webhookSecret ? false : true,
  perspective: 'published',
})
