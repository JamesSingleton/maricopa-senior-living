import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

const timeZone = 'America/Phoenix'

export default function Date({
  dateString,
  className,
}: {
  dateString: string
  className?: string
}) {
  const date = parseISO(dateString)
  const test = utcToZonedTime(dateString, timeZone)

  return (
    <time dateTime={dateString} className={className}>
      {format(utcToZonedTime(date, timeZone), 'LLL d, yyyy')}
    </time>
  )
}
