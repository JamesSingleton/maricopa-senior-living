import { FileText, HomeIcon, CogIcon, PanelBottomIcon, PanelTopIcon } from "lucide-react";
import {
  BookIcon,
  DocumentTextIcon,
  PinIcon,
  TagIcon,
  TagsIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";

const createSingleton = (
  S: StructureBuilder,
  type: string,
  title: string,
  icon?: React.ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type));

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Site")
            .items([
              createSingleton(S, "homePage", "Home Page", HomeIcon),
              createSingleton(S, "siteSettings", "Site Settings", CogIcon),
              createSingleton(S, "mainNavigation", "Navigation", PanelTopIcon),
              createSingleton(S, "siteFooter", "Footer", PanelBottomIcon),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("resource")
        .title("Resources")
        .icon(PinIcon),
      S.documentTypeListItem("guide")
        .title("Guides")
        .icon(BookIcon),
      S.documentTypeListItem("article")
        .title("Articles")
        .icon(DocumentTextIcon),
      S.documentTypeListItem("category")
        .title("Categories")
        .icon(TagIcon),
      S.documentTypeListItem("tag")
        .title("Tags")
        .icon(TagsIcon),
      S.documentTypeListItem("page")
        .title("Pages")
        .icon(FileText),
      S.documentTypeListItem("author")
        .title("Authors")
        .icon(UserIcon),
    ]);
