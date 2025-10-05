import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const timeZone = 'America/Phoenix'

export default function Date({
  dateString,
  className,
}: {
  dateString: string
  className?: string
}) {
  const date = parseISO(dateString)

  return (
    <time dateTime={dateString} className={className}>
      {format(toZonedTime(date, timeZone), 'LLL d, yyyy')}
    </time>
  )
}
