import { defineField, type ImageRule, type ImageValue, type ValidationBuilder } from 'sanity'

import { PathnameFieldComponent } from '../components/slug-field-component'
import { GROUP } from '../utils/constants'
import { createSlugValidator, getDocumentTypeConfig } from '../utils/slug-validation'

export const richTextField = defineField({
  name: 'richText',
  type: 'richText',
  description:
    'A text editor that lets you add formatting like bold text, links, and bullet points',
})

export const buttonsField = defineField({
  name: 'buttons',
  type: 'array',
  of: [{ type: 'button' }],
  description: 'Add one or more clickable buttons that visitors can use to navigate your website',
})

export const pageBuilderField = defineField({
  name: 'pageBuilder',
  group: GROUP.MAIN_CONTENT,
  type: 'pageBuilder',
  description:
    'Build your page by adding different sections like text, images, and other content blocks.',
})

export const iconField = defineField({
  name: 'icon',
  title: 'Icon',
  type: 'lucide-icon',
  description:
    'Choose a small picture symbol to represent this item, like a home icon or shopping cart',
})

export const documentSlugField = (
  documentType: string,
  options: {
    group?: string
    description?: string
    title?: string
  } = {},
) => {
  const {
    group,
    description = `The web address where people can find your ${documentType} (automatically created from title)`,
    title = 'URL',
  } = options

  return defineField({
    name: 'slug',
    type: 'slug',
    title,
    description,
    group,
    components: {
      field: PathnameFieldComponent,
    },
    validation: (Rule) => [
      Rule.required().error('A URL slug is required'),
      Rule.custom(createSlugValidator(getDocumentTypeConfig(documentType))),
    ],
  })
}

export const imageWithAltField = ({
  name = 'image',
  title = 'Image',
  description = 'An image, make sure to add an alt text and use the hotspot tool to ensure if image is cropped it highlights the focus point',
  validation,
  group,
}: {
  name?: string
  title?: string
  description?: string
  group?: string
  validation?: ValidationBuilder<ImageRule, ImageValue>
} = {}) =>
  defineField({
    name,
    type: 'image',
    title,
    description,
    group,
    validation,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
        description: 'The text that describes the image for screen readers and search engines',
      }),
    ],
  })

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO meta title override',
    description: 'This will override the meta title. If left blank it will inherit the page title.',
    type: 'string',
    validation: (rule) => rule.warning('A page title is required'),
    group: GROUP.SEO,
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO meta description override',
    description:
      'This will override the meta description. If left blank it will inherit the description from the page description.',
    type: 'text',
    rows: 2,
    validation: (rule) => [
      rule.warning('A description is required'),
      rule.max(160).warning('No more than 160 characters'),
    ],
    group: GROUP.SEO,
  }),
  defineField({
    name: 'seoImage',
    title: 'SEO image override',
    description:
      'This will override the main image. If left blank it will inherit the image from the main image.',
    type: 'image',
    group: GROUP.SEO,
    options: {
      hotspot: true,
    },
  }),
  defineField({
    name: 'seoNoIndex',
    title: 'Do not index this page',
    description: "If checked, this content won't be indexed by search engines.",
    type: 'boolean',
    initialValue: () => false,
    group: GROUP.SEO,
  }),
  defineField({
    name: 'seoHideFromLists',
    title: 'Hide from lists',
    description: "If checked, this content won't appear in any list pages.",
    type: 'boolean',
    initialValue: () => false,
    group: GROUP.SEO,
  }),
]

export const ogFields = [
  defineField({
    name: 'ogTitle',
    title: 'Open graph title override',
    description:
      'This will override the open graph title. If left blank it will inherit the page title.',
    type: 'string',
    validation: (Rule) => Rule.warning('A page title is required'),
    group: GROUP.OG,
  }),
  defineField({
    name: 'ogDescription',
    title: 'Open graph description override',
    description:
      'This will override the meta description. If left blank it will inherit the description from the page description.',
    type: 'text',
    rows: 2,
    validation: (Rule) => [
      Rule.warning('A description is required'),
      Rule.max(160).warning('No more than 160 characters'),
    ],
    group: GROUP.OG,
  }),
]
