import { BellIcon } from "@sanity/icons/Bell";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { ClockIcon } from "@sanity/icons/Clock";
import { CogIcon } from "@sanity/icons/Cog";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import type { StructureResolver } from "sanity/structure";

import { isAdmin } from "./lib/access";

const REVIEW_TYPES = [
  { type: "resource", title: "Resources" },
  { type: "helpfulLink", title: "Helpful links" },
  { type: "article", title: "Articles" },
];

/**
 * Ron's Studio: his everyday jobs first, in plain words. Site structure is
 * tucked under "Site setup", visible only to administrators.
 */
export const structure: StructureResolver = (S, { currentUser }) => {
  const admin = isAdmin(currentUser);

  // Registered in sanity.config.ts `document.singletons`.
  const singleton = (id: "home" | "settings" | "navigation") =>
    S.listItem().singleton(id);

  const list = (type: string, title: string) =>
    S.documentTypeListItem(type).title(title);

  return S.list()
    .title("Maricopa Senior Living")
    .items([
      list("monthlyUpdate", "What's New (monthly)").icon(BellIcon),
      S.listItem()
        .title("Events")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Events")
            .items([
              S.listItem()
                .title("Upcoming & repeating")
                .child(
                  S.documentTypeList("event")
                    .title("Upcoming & repeating")
                    .filter(
                      '_type == "event" && (dateTime(coalesce(end, start)) >= dateTime(now()) || (defined(repeat.until) && repeat.until >= now()))',
                    )
                    .defaultOrdering([{ field: "start", direction: "asc" }]),
                ),
              S.listItem()
                .title("Past events")
                .child(
                  S.documentTypeList("event")
                    .title("Past events")
                    .filter(
                      '_type == "event" && dateTime(coalesce(end, start)) < dateTime(now()) && !(defined(repeat.until) && repeat.until >= now())',
                    )
                    .defaultOrdering([{ field: "start", direction: "desc" }]),
                ),
            ]),
        ),
      list("resource", "Resources"),
      list("helpfulLink", "Helpful links"),
      list("article", "Articles"),
      list("newsletterEdition", "Newsletters"),
      S.divider(),
      list("page", "Pages"),
      singleton("home"),
      list("author", "Writers"),
      S.divider(),
      S.listItem()
        .title("Needs review")
        .icon(WarningOutlineIcon)
        .child(
          S.list()
            .title("Brought over from the old site — please check")
            .items(
              REVIEW_TYPES.map(({ type, title }) =>
                S.listItem()
                  .title(title)
                  .id(`review-${type}`)
                  .schemaType(type)
                  .child(
                    S.documentTypeList(type)
                      .title(`${title} to check`)
                      .filter(`_type == "${type}" && needsReview == true`),
                  ),
              ),
            ),
        ),
      S.listItem()
        .title("Due for checking")
        .icon(ClockIcon)
        .child(
          S.documentTypeList("resource")
            .title("Resources not checked in a year")
            .filter(
              '_type == "resource" && (!defined(lastVerified) || lastVerified < string::split(string(dateTime(now()) - 60*60*24*365), "T")[0])',
            )
            .defaultOrdering([{ field: "lastVerified", direction: "asc" }]),
        ),
      ...(admin
        ? [
            S.divider(),
            S.listItem()
              .title("Site setup (admin)")
              .icon(CogIcon)
              .child(
                S.list()
                  .title("Site setup")
                  .items([
                    singleton("settings"),
                    singleton("navigation"),
                    list("topic", "Topics"),
                    list("redirect", "Redirects"),
                  ]),
              ),
          ]
        : []),
    ]);
};
