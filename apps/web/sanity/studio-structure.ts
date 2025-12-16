import type { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { File, HomeIcon, MenuIcon, TagIcon, type LucideIcon } from 'lucide-react'

import { SchemaType, SingletonType } from './schemaTypes'

type Base<T = SchemaType> = {
  id?: string
  type: T
  preview?: boolean
  title: string
  icon?: LucideIcon
}

type CreateSingleton = {
  S: StructureBuilder
} & Base<SingletonType>

const createSingleton = ({ S, type, title, icon }: CreateSingleton) => {
  return S.listItem()
    .title(title)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type))
}

type CreateList = {
  S: StructureBuilder
} & Base

const createList = ({ S, type, icon, title, id }: CreateList) => {
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(title)
    .icon(icon ?? File)
}

export const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('Content')
    .items([
      createList({
        S,
        type: 'post',
        icon: File,
        title: 'Posts',
      }),
      createList({
        S,
        type: 'author',
        icon: File,
        title: 'Authors',
      }),
      createList({
        S,
        type: 'category',
        icon: File,
        title: 'Categories',
      }),
      createList({
        S,
        type: 'tag',
        icon: TagIcon,
        title: 'Tags',
      }),
      createList({
        S,
        type: 'service',
        icon: File,
        title: 'Services',
      }),

      createList({
        S,
        type: 'page',
        icon: File,
        title: 'Pages',
      }),
      S.divider(),
      createSingleton({
        S,
        type: 'home',
        icon: HomeIcon,
        title: 'Home',
      }),
      createSingleton({
        S,
        type: 'navigation',
        icon: MenuIcon,
        title: 'Navigation',
      }),
    ])
