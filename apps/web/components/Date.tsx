import { format, isValid, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "America/Phoenix";

export default function DateComponent({
  dateString,
  className,
}: {
  dateString?: string | null;
  className?: string;
}) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  // An unpublished draft or bad value would otherwise throw and crash the page.
  if (!isValid(date)) return null;

  return (
    <time dateTime={dateString} className={className}>
      {format(toZonedTime(date, timeZone), "LLL d, yyyy")}
    </time>
  );
}
