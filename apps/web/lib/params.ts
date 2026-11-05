/** Helpers for URL search params, which can arrive as arrays or junk. */
export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export function firstParam(
  value: string | string[] | undefined,
  maxLength = 100,
) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function pageParam(value: string | string[] | undefined, max = 200) {
  const page = Number.parseInt(firstParam(value) || "1", 10);
  return Number.isFinite(page) ? Math.min(Math.max(page, 1), max) : 1;
}
