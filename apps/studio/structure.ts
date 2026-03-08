import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  HomeIcon,
  type LucideIcon,
  MessageCircle,
  PanelBottomIcon,
  PanelsTopLeftIcon,
  PanelTopIcon,
  Settings2,
  TagIcon,
  TagsIcon,
  User,
} from 'lucide-react'
import type { ListItemBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure'

import type { SchemaType, SingletonType } from './schemaTypes'
import { getTitleCase } from './utils/helper'

type Base<T = SchemaType> = {
  id?: string
  type: T
  preview?: boolean
  title?: string
  icon?: LucideIcon
}

type CreateSingleton = {
  S: StructureBuilder
} & Base<SingletonType>

type CreateList = {
  S: StructureBuilder
} & Base

type CreateIndexList = {
  S: StructureBuilder
  list: Base
  index: Base<SingletonType>
  context: StructureResolverContext
}

const createSingleton = ({ S, type, title, icon }: CreateSingleton) => {
  const newTitle = title ?? getTitleCase(type)
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type))
}

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type)
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File)
}

const createIndexListWithOrderableItems = ({ S, index, list, context }: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type)
  const listTitle = list.title ?? getTitleCase(list.type)
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document().views([S.view.form()]).schemaType(index.type).documentId(index.type),
            ),
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            icon: list.icon ?? File,
            title: `${listTitle}`,
          }),
        ]),
    )
}

export const structure = (S: StructureBuilder, context: StructureResolverContext) => {
  return S.list()
    .title('Content')
    .items([
      // createSingleton({ S, type: 'homePage', icon: HomeIcon }),
      S.divider(),
      // createHierarchicalPageStructure(S, context),
      // createSlugBasedStructure(S, "page"),
      // createSlugBasedStructure(S, 'page'),
      createIndexListWithOrderableItems({
        S,
        index: { type: 'blogIndex', icon: BookMarked },
        list: { type: 'blog', title: 'Blogs', icon: FileText },
        context,
      }),
      // createList({
      //   S,
      //   type: 'faq',
      //   title: 'FAQs',
      //   icon: MessageCircle,
      // }),
      createList({ S, type: 'author', title: 'Authors', icon: User }),
      createList({ S, type: 'category', title: 'Categories', icon: TagIcon }),
      createList({ S, type: 'page', title: 'Pages', icon: PanelsTopLeftIcon }),
      createList({ S, type: 'post', title: 'Posts', icon: FileText }),
      createList({ S, type: 'service', title: 'Services', icon: BookMarked }),
      createList({ S, type: 'tag', title: 'Tags', icon: TagsIcon }),
      S.divider(),
      S.listItem()
        .title('Site Configuration')
        .icon(Settings2)
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              createSingleton({
                S,
                type: 'navbar',
                title: 'Navigation',
                icon: PanelTopIcon,
              }),
              createSingleton({
                S,
                type: 'footer',
                title: 'Footer',
                icon: PanelBottomIcon,
              }),
              createSingleton({
                S,
                type: 'settings',
                title: 'Global Settings',
                icon: CogIcon,
              }),
            ]),
        ),
    ])
}
