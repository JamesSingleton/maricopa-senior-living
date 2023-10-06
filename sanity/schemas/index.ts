import category from './documents/category'
import post from './documents/post'
import author from './documents/author'
import tag from './documents/tag'
import service from './documents/service'
import blockContent from './blockContent'
import menu from './documents/menu'
import link from './objects/link'
import page from './documents/page'
import home from './singletons/home'
import { timeValueType } from './strings/timeValue'
import dayAndTime from './objects/dayAndTime'
import navigation from './singletons/navigation'

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
  home,
  navigation,
]

export const SINGLETON_ITEMS = [home, navigation]
