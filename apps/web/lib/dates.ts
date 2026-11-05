/**
 * Every date on the site is shown in Arizona time (America/Phoenix, no
 * daylight saving). Servers run in UTC, so never format without `timeZone`.
 */
export const SITE_TIME_ZONE = "America/Phoenix";
/** Arizona is UTC−7 all year. */
export const ARIZONA_OFFSET = "-07:00";

function toDate(value: string | Date | null | undefined) {
  if (!value) return null;
  // Plain dates ("2026-11-04") are Arizona calendar days, not UTC midnight.
  const date =
    value instanceof Date
      ? value
      : /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T12:00:00${ARIZONA_OFFSET}`)
        : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function format(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions,
) {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: SITE_TIME_ZONE,
        ...options,
      }).format(date)
    : null;
}

/** "November 4, 2026" */
export const formatLongDate = (value: string | Date | null | undefined) =>
  format(value, { month: "long", day: "numeric", year: "numeric" });

/** "Wednesday, November 4" */
export const formatDayHeading = (value: string | Date | null | undefined) =>
  format(value, { weekday: "long", month: "long", day: "numeric" });

/** "9:30 AM" */
export const formatTime = (value: string | Date | null | undefined) =>
  format(value, { hour: "numeric", minute: "2-digit" });

/** Arizona calendar day key, "2026-11-04". */
export function dayKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(toDate(value) ?? new Date());
  return parts;
}

/** Arizona month key, "2026-11". */
export const monthKey = (value: string | Date = new Date()) =>
  dayKey(value).slice(0, 7);

export function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, 15)).toLocaleString(
    "en-US",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );
}

export function isMonthKey(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value));
}

export function shiftMonth(key: string, delta: number) {
  const [year = 0, month = 1] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 15));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** First and last instant of an Arizona month, as ISO strings. */
export function monthRange(key: string) {
  const next = shiftMonth(key, 1);
  return {
    from: new Date(`${key}-01T00:00:00${ARIZONA_OFFSET}`).toISOString(),
    to: new Date(
      new Date(`${next}-01T00:00:00${ARIZONA_OFFSET}`).getTime() - 1,
    ).toISOString(),
  };
}

const CLOCK = /^(\d{1,2}):(\d{2})$/;
/** "13:30" → "1:30 PM" */
export function formatClock(value?: string | null) {
  const match = value?.match(CLOCK);
  if (!match) return value ?? "";
  const hours = Number(match[1]);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${match[2]} ${hours < 12 ? "AM" : "PM"}`;
}
