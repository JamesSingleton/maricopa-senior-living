import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  BookMarked,
  BookOpen,
  Calendar,
  CogIcon,
  FileText,
  Home,
  Newspaper,
  PanelBottomIcon,
  PanelTopIcon,
  TagIcon,
  TagsIcon,
  User,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import { createList, createSingleton, SINGLETON_TYPES } from "./helpers";

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Maricopa Senior Living")
    .items([
      S.divider().title("Your Website"),
      createSingleton({ S, type: "home", title: "Home Page", icon: Home }),
      createSingleton({
        S,
        type: "navbar",
        title: "Top Menu",
        icon: PanelTopIcon,
      }),
      createSingleton({
        S,
        type: "footer",
        title: "Footer",
        icon: PanelBottomIcon,
      }),
      createSingleton({
        S,
        type: "settings",
        title: "Website Settings",
        icon: CogIcon,
      }),

      S.divider().title("Website Pages"),
      createList({ S, type: "page", title: "Info Pages", icon: BookOpen }),
      createSingleton({
        S,
        type: "blogIndex",
        title: "Blog Main Page",
        icon: BookMarked,
      }),

      S.divider().title("News & Articles"),
      orderableDocumentListDeskItem({
        type: "blog",
        title: "Our Blog Posts",
        icon: FileText,
        S,
        context,
        createIntent: true,
      }),
      createList({ S, type: "article", title: "Articles", icon: Newspaper }),
      createList({ S, type: "event", title: "Events", icon: Calendar }),

      S.divider().title("Resource Directory"),
      createList({
        S,
        type: "resource",
        title: "Local Resources",
        icon: BookMarked,
      }),

      S.divider().title("Organize Content"),
      createList({ S, type: "category", title: "Categories", icon: TagIcon }),
      createList({ S, type: "tag", title: "Tags", icon: TagsIcon }),
      createList({ S, type: "author", title: "Authors", icon: User }),
    ]);
};

export { SINGLETON_TYPES };
