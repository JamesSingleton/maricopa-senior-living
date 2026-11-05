const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DayHours = { day?: string; opensAt?: string; closesAt?: string };

/** "13:30" → "1:30 PM". Falls back to the stored text instead of throwing. */
function formatClock(value?: string) {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value ?? "";
  const hours = Number(match[1]);
  const minutes = match[2];
  if (hours > 23) return value ?? "";
  const suffix = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

export default function BusinessHours({ hours }: { hours: DayHours[] }) {
  const getHoursForDay = (day: string) => {
    const matchingDay = hours.find((h) => h?.day === day);
    if (!matchingDay) return "Closed";
    return `${formatClock(matchingDay.opensAt)} – ${formatClock(matchingDay.closesAt)}`;
  };

  return (
    <table className="w-full whitespace-nowrap text-left text-base leading-7">
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Hours</th>
        </tr>
      </thead>
      <tbody>
        {DAYS_OF_WEEK.map((day) => (
          <tr key={day}>
            <th scope="row" className="font-normal">
              {day}
            </th>
            <td className="text-zinc-700">{getHoursForDay(day)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
