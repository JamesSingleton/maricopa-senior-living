import { BellIcon } from "@sanity/icons/Bell";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { ClockIcon } from "@sanity/icons/Clock";
import { CogIcon } from "@sanity/icons/Cog";
import { TagsIcon } from "@sanity/icons/Tags";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import type { StructureResolver } from "sanity/structure";

import { isAdmin } from "./lib/access";

const REVIEW_TYPES = [
  { type: "resource", title: "Resources" },
  { type: "helpfulLink", title: "Helpful links" },
  { type: "article", title: "Articles" },
];

const IN_TOPIC = [
  { id: "resources", type: "resource", title: "Resources (places to call)" },
  { id: "links", type: "helpfulLink", title: "Helpful links" },
  { id: "articles", type: "article", title: "Articles" },
  { id: "events", type: "event", title: "Events" },
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

  /** Everything filed under one topic, split by kind. */
  const topicLists = (topicId: string) =>
    S.list()
      .id(topicId)
      .title("In this topic")
      .items(
        IN_TOPIC.map(({ id, type, title }) =>
          S.listItem()
            .title(title)
            .id(id)
            .schemaType(type)
            .child(
              S.documentTypeList(type)
                .title(title)
                .filter("_type == $type && references($topicId)")
                .params({ type, topicId }),
            ),
        ),
      );

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
      // Path used by the Topics screen: by-topic;<topic id>;<list id>
      S.listItem()
        .title("Browse by topic")
        .id("by-topic")
        .icon(TagsIcon)
        .child(
          S.list()
            .title("Browse by topic")
            .items([
              S.listItem()
                .title("No topic yet")
                .id("no-topic")
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title("Published without a topic")
                    .filter(
                      '_type in ["resource", "helpfulLink", "article"] && count(topics) < 1',
                    ),
                ),
              S.divider(),
              S.documentTypeListItem("topic")
                .title("All topics")
                .id("all")
                .child(
                  S.documentTypeList("topic")
                    .title("Choose a topic")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                    .child((topicId) => topicLists(topicId)),
                ),
            ]),
        ),
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
