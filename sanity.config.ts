import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId, dataset } from './lib/sanity.api'

export default defineConfig({
  name: 'default',
  title: 'Maricopa Senior Living',
  projectId: projectId,
  dataset: dataset,
  plugins: [deskTool(), visionTool()],
  basePath: '/admin',
  apiVersion: '2023-04-27',
  schema: {
    types: schemaTypes,
  },
})
