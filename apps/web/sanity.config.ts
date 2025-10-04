import { assist } from '@sanity/assist'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'
import { schemaTypes, SINGLETON_ITEMS } from './sanity/schemas'
import { projectId, dataset } from './lib/sanity.api'
import { pageStructure, singletonPlugin } from './sanity/plugins/settings'

export default defineConfig({
  title: 'Maricopa Senior Living',
  basePath: '/admin',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  mediaLibrary: {
    enabled: true,
  },
  plugins: [
    assist(),
    visionTool(),
    structureTool({
      structure: pageStructure(SINGLETON_ITEMS),
    }),
    media({
      creditLine: {
        enabled: true,
      },
    }),
    singletonPlugin([SINGLETON_ITEMS[0].name, SINGLETON_ITEMS[1].name]),
  ],
})
