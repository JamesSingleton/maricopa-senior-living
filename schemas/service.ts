import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'Title of what you want to show up, for example "F.O.R. Maricopa"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      description: 'What categories does this belong to?',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      description: 'What tags apply to this?',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      type: 'text',
      name: 'description',
      title: 'Description',
      description: 'A short little description of the result',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'text',
      name: 'audience',
      title: 'Audience/Eligibility',
      description: 'What is the audience or who is eligible for this?',
    }),
    defineField({
      type: 'url',
      name: 'website',
      title: 'Website',
      description: 'Is there a website URL people can go to? If so, add it here.',
    }),
    defineField({
      type: 'string',
      name: 'phone',
      title: 'Phone Number',
      description: 'Is there a phone number people can call? If so, add it here.',
    }),
    defineField({
      type: 'string',
      name: 'address',
      title: 'Address',
      description: 'Is there a physical address? If so, add it here.',
    }),
    defineField({
      type: 'text',
      name: 'notes',
      title: 'Notes',
      description: 'Any notes you want to add?',
    }),
    defineField({
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [{ type: 'file' }],
    }),
  ],
})
