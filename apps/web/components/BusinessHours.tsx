import { format } from "date-fns";

export default function BusinessHours({ hours }: { hours: any[] }) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const getHoursForDay = (day: string) => {
    const matchingDay = hours.find((h) => h.day === day);
    if (matchingDay) {
      return `${format(new Date(`2000-01-01T${matchingDay.opensAt}:00`), "h:mm a")} - ${format(
        new Date(`2000-01-01T${matchingDay.closesAt}:00`),
        "h:mm a",
      )}`;
    } else {
      return "Closed";
    }
  };

  return (
    <table className="w-full whitespace-nowrap text-left text-sm leading-6">
      <thead>
        <tr>
          <th>Day</th>
          <th>Hours</th>
        </tr>
      </thead>
      <tbody>
        {/* Loop through each day of the week */}
        {daysOfWeek.map((day) => (
          <tr key={day}>
            <td>{day}</td>
            <td className="text-zinc-700">{getHoursForDay(day)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
