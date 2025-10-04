import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'
import { schemaTypes, SINGLETON_ITEMS } from './sanity/schemas'
import { projectId, dataset } from './lib/sanity.api'
import { pageStructure, singletonPlugin } from './sanity/plugins/settings'

export default defineConfig({
  name: 'default',
  title: 'Maricopa Senior Living',
  projectId: projectId,
  dataset: dataset,
  mediaLibrary: {
    enabled: true,
  },
  plugins: [
    assist(),
    structureTool({
      structure: pageStructure(SINGLETON_ITEMS),
    }),
    visionTool(),
    singletonPlugin([SINGLETON_ITEMS[0].name, SINGLETON_ITEMS[1].name]),
    media({
      creditLine: {
        enabled: true,
      },
    }),
  ],
  basePath: '/admin',
  apiVersion: '2023-04-27',
  schema: {
    types: schemaTypes,
  },
})
