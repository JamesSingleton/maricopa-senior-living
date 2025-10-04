import { defineType } from 'sanity'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const verifyInput = (dayAndTime: any) => {
  const { day, opensAt, closesAt } = dayAndTime
  if (!day) {
    return 'Please select a day'
  }
  if (!opensAt) {
    return 'Choose when the store opens'
  }
  if (!closesAt) {
    return 'Choose when the store closes'
  }
  return opensAt < closesAt ? true : `Let's open the store before we close it on ${day}, shall we?`
}

export default defineType({
  name: 'dayAndTime',
  title: 'Day and Time',
  type: 'object',
  validation: (rule) => rule.custom(verifyInput),
  fields: [
    {
      name: 'day',
      title: 'Day',
      type: 'string',
      description: 'Select a day of the week',
      options: {
        list: days,
      },
    },
    {
      name: 'opensAt',
      title: 'Opens at',
      type: 'timeValue',
    },
    {
      name: 'closesAt',
      title: 'Closes at',
      type: 'timeValue',
    },
  ],
  preview: {
    select: {
      day: 'day',
      opensAt: 'opensAt',
      closesAt: 'closesAt',
    },
    prepare({ day, opensAt, closesAt }) {
      return {
        title: `${day}`,
        subtitle: `${opensAt} - ${closesAt}`,
      }
    },
  },
})
