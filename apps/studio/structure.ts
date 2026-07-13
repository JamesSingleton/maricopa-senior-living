import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HomeIcon } from "@sanity/icons/Home";
import { MenuIcon } from "@sanity/icons/Menu";
import { TagIcon } from "@sanity/icons/Tag";
import { TagsIcon } from "@sanity/icons/Tags";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

import { createSingleton } from "./utils/singleton";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.divider().title("Website"),
      createSingleton(S, "homePage", "Home", HomeIcon),
      S.documentTypeListItem("page").title("Pages").icon(DocumentIcon),

      S.divider().title("Resource hub"),
      S.listItem()
        .title("Resources")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Resources")
            .items([
              S.listItem()
                .title("All Resources")
                .icon(CaseIcon)
                .child(
                  S.documentTypeList("resource")
                    .title("All Resources")
                    .defaultOrdering([{ field: "title", direction: "asc" }]),
                ),
              S.listItem()
                .title("Directory Listings")
                .icon(CaseIcon)
                .child(
                  S.documentList()
                    .title("Directory Listings")
                    .filter('_type == "resource" && kind == $kind')
                    .params({ kind: "directory" })
                    .defaultOrdering([{ field: "title", direction: "asc" }]),
                ),
              S.listItem()
                .title("Guides & Toolkits")
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title("Guides & Toolkits")
                    .filter('_type == "resource" && kind == $kind')
                    .params({ kind: "guide" })
                    .defaultOrdering([{ field: "title", direction: "asc" }]),
                ),
            ]),
        ),
      S.documentTypeListItem("article")
        .title("Articles")
        .icon(DocumentTextIcon),

      S.divider().title("Taxonomy"),
      S.documentTypeListItem("category").title("Categories").icon(TagIcon),
      S.documentTypeListItem("tag").title("Tags").icon(TagsIcon),
      S.documentTypeListItem("author").title("Authors").icon(UserIcon),

      S.divider().title("Configuration"),
      createSingleton(S, "navigation", "Navigation", MenuIcon),
      createSingleton(S, "settings", "Site Settings", CogIcon),
    ]);
