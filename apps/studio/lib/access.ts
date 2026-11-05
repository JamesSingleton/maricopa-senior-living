import type { CurrentUser } from "sanity";

/**
 * Ron edits as an "editor"; James administers. Structure (topics, navigation,
 * redirects, settings) is admin-only so the site can't sprawl again.
 */
export function isAdmin(user: Omit<CurrentUser, "role"> | null | undefined) {
  return Boolean(user?.roles?.some((role) => role.name === "administrator"));
}

/** `readOnly` callback for admin-only fields and documents. */
export const adminOnly = ({
  currentUser,
}: {
  currentUser?: Omit<CurrentUser, "role"> | null;
}) => !isAdmin(currentUser);

/** Document types only an administrator may create, edit or delete. */
export const ADMIN_ONLY_TYPES = new Set([
  "topic",
  "navigation",
  "settings",
  "redirect",
]);

/** One-of-a-kind documents with fixed IDs; never duplicated or deleted. */
export const SINGLETONS = {
  home: { id: "home", title: "Home page" },
  settings: { id: "settings", title: "Site settings" },
  navigation: { id: "navigation", title: "Menus" },
} as const;

export const SINGLETON_TYPES = new Set(Object.keys(SINGLETONS));
