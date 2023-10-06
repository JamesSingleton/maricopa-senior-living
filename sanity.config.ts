import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes, SINGLETON_ITEMS } from './sanity/schemas'
import { projectId, dataset } from './lib/sanity.api'
import { pageStructure, singletonPlugin } from './sanity/plugins/settings'

export default defineConfig({
  name: 'default',
  title: 'Maricopa Senior Living',
  projectId: projectId,
  dataset: dataset,
  plugins: [
    deskTool({
      structure: pageStructure(SINGLETON_ITEMS),
    }),
    visionTool(),
    singletonPlugin([SINGLETON_ITEMS[0].name, SINGLETON_ITEMS[1].name]),
  ],
  basePath: '/admin',
  apiVersion: '2023-04-27',
  schema: {
    types: schemaTypes,
  },
})
