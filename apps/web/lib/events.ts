import { ARIZONA_OFFSET, dayKey, formatDayHeading, formatTime } from "./dates";

export type EventSource = {
  _id: string;
  title: string | null;
  slug: string | null;
  start: string | null;
  end?: string | null;
  allDay?: boolean | null;
  repeat?: {
    frequency?: string | null;
    until?: string | null;
    skipDates?: string[] | null;
  } | null;
  location?: string | null;
  hostedByMsl?: boolean | null;
  summary?: string | null;
  status?: string | null;
  attendance?: string | null;
};

/** One date an event happens on (a repeating event yields several). */
export type Occurrence = EventSource & {
  key: string;
  /** This occurrence's start and end. */
  at: string;
  until: string | null;
  repeats: boolean;
};

const DAY_MS = 24 * 3600 * 1000;
/** Repeats are capped at a year in the Studio; guard anyway. */
const MAX_OCCURRENCES = 400;

/** Arizona wall-clock parts for an instant (Arizona has no DST). */
function arizonaParts(date: Date) {
  const shifted = new Date(date.getTime() - 7 * 3600 * 1000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
  };
}

function arizonaInstant(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
) {
  return new Date(Date.UTC(year, month, day, hours + 7, minutes));
}

/** Expand repeats into individual dates that fall within [from, to]. */
export function expandOccurrences(
  events: EventSource[],
  from: Date,
  to: Date,
): Occurrence[] {
  const out: Occurrence[] = [];
  for (const event of events) {
    if (!event.start || !event.slug) continue;
    const start = new Date(event.start);
    const duration = event.end
      ? new Date(event.end).getTime() - start.getTime()
      : 0;
    const frequency = event.repeat?.frequency ?? "none";
    const repeats = frequency !== "none" && Boolean(event.repeat?.until);
    const skip = new Set(event.repeat?.skipDates ?? []);
    const lastDay = repeats
      ? new Date(`${event.repeat?.until}T23:59:59${ARIZONA_OFFSET}`)
      : start;

    const push = (at: Date) => {
      const end = duration > 0 ? new Date(at.getTime() + duration) : null;
      // Keep an occurrence until it has ended, so today's events still show.
      const visibleUntil =
        end ??
        new Date(at.getTime() + (event.allDay ? DAY_MS : 2 * 3600 * 1000));
      if (visibleUntil < from || at > to) return;
      if (skip.has(dayKey(at))) return;
      out.push({
        ...event,
        key: `${event._id}:${at.toISOString()}`,
        at: at.toISOString(),
        until: end?.toISOString() ?? null,
        repeats,
      });
    };

    if (!repeats) {
      push(start);
      continue;
    }

    const first = arizonaParts(start);
    let count = 0;
    if (frequency === "weekly") {
      for (
        let at = start;
        at <= lastDay && count < MAX_OCCURRENCES;
        at = new Date(at.getTime() + 7 * DAY_MS)
      ) {
        push(at);
        count++;
      }
    } else if (frequency === "monthlyDate" || frequency === "monthlyWeekday") {
      // Which week of the month the first date falls in (1st…5th weekday).
      const nth = Math.ceil(first.day / 7);
      for (let offset = 0; count < MAX_OCCURRENCES; offset++, count++) {
        const monthIndex = first.month + offset;
        const year = first.year + Math.floor(monthIndex / 12);
        const month = ((monthIndex % 12) + 12) % 12;
        let day: number | null;
        if (frequency === "monthlyDate") {
          const daysInMonth = new Date(
            Date.UTC(year, month + 1, 0),
          ).getUTCDate();
          day = first.day <= daysInMonth ? first.day : null; // no Feb 30th
        } else {
          const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
          const candidate =
            1 + ((first.weekday - firstWeekday + 7) % 7) + (nth - 1) * 7;
          const daysInMonth = new Date(
            Date.UTC(year, month + 1, 0),
          ).getUTCDate();
          day = candidate <= daysInMonth ? candidate : null; // no 5th Thursday
        }
        if (day === null) continue;
        const at = arizonaInstant(year, month, day, first.hours, first.minutes);
        if (at > lastDay) break;
        push(at);
      }
    }
  }
  return out.sort(
    (a, b) =>
      a.at.localeCompare(b.at) || (a.title ?? "").localeCompare(b.title ?? ""),
  );
}

/** "9:30 AM – 11:00 AM", "All day", or "9:30 AM". */
export function timeRange(
  occurrence: Pick<Occurrence, "at" | "until" | "allDay">,
) {
  if (occurrence.allDay) return "All day";
  const start = formatTime(occurrence.at);
  if (!occurrence.until) return start ?? "";
  if (dayKey(occurrence.until) !== dayKey(occurrence.at)) {
    return `${start} – ${formatDayHeading(occurrence.until)}, ${formatTime(occurrence.until)}`;
  }
  return `${start} – ${formatTime(occurrence.until)}`;
}

/** Plain-English repeat rule, e.g. "Every Wednesday until December 31". */
export function repeatLabel(event: EventSource) {
  const frequency = event.repeat?.frequency;
  if (
    !event.start ||
    !frequency ||
    frequency === "none" ||
    !event.repeat?.until
  )
    return null;
  const until = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${event.repeat.until}T12:00:00${ARIZONA_OFFSET}`));
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "long",
  }).format(new Date(event.start));
  if (frequency === "weekly") return `Every ${weekday} until ${until}`;
  const day = arizonaParts(new Date(event.start)).day;
  if (frequency === "monthlyDate")
    return `Every month on the ${ordinal(day)} until ${until}`;
  return `The ${ordinal(Math.ceil(day / 7))} ${weekday} of every month until ${until}`;
}

function ordinal(n: number) {
  const suffix =
    n % 10 === 1 && n !== 11
      ? "st"
      : n % 10 === 2 && n !== 12
        ? "nd"
        : n % 10 === 3 && n !== 13
          ? "rd"
          : "th";
  return `${n}${suffix}`;
}

/** Group occurrences by Arizona calendar day, in order. */
export function groupByDay(occurrences: Occurrence[]) {
  const groups = new Map<string, Occurrence[]>();
  for (const occurrence of occurrences) {
    const key = dayKey(occurrence.at);
    groups.set(key, [...(groups.get(key) ?? []), occurrence]);
  }
  return [...groups.entries()].map(([day, items]) => ({ day, items }));
}
