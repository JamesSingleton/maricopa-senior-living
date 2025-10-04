import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '@/lib/sanity.api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
