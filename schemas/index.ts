import category from './documents/category'
import post from './documents/post'
import author from './documents/author'
import tag from './documents/tag'
import service from './documents/service'
import blockContent from './blockContent'
import menu from './documents/menu'
import link from './objects/link'
import page from './documents/page'
import { timeValueType } from './strings/timeValue'
import dayAndTime from './objects/dayAndTime'

export const schemaTypes = [
  post,
  author,
  category,
  blockContent,
  tag,
  service,
  menu,
  link,
  page,
  timeValueType,
  dayAndTime,
]
