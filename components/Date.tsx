import { format, parseISO } from 'date-fns'

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
      {format(parseISO(dateString), 'LLL d, yyyy')}
    </time>
  )
}
