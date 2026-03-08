import { defineType, defineField } from 'sanity'
import { Text } from 'lucide-react'

export const contentBlock = defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  icon: Text,
  description: 'Add text content to your page. You can format text, add links, lists, and more.',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'richText',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const contentPreview = content?.[0]?.children?.[0]?.text?.substring(0, 100) || 'Text content'
      return {
        title: 'Text Content',
        subtitle: contentPreview + '...',
      }
    },
  },
})
