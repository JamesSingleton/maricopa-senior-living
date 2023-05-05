import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Maricopa Senior Living',
  projectId: 'bksfw1p8',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  basePath: '/admin',
  apiVersion: '2023-04-27',
  schema: {
    types: schemaTypes,
  },
})
