import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'bksfw1p8',
    dataset: 'production',
  },
  typegen: {
    path: './**/*.{ts,tsx,js,jsx}',
    generates: './lib/sanity/sanity.types.ts',
    schema: 'schema.json',
    overloadClientMethods: true,
  },
})
