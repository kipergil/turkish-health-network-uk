import type { OpeningHoursEntry, Weekday } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const WEEKDAY_ORDER: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function currentWeekday(): Weekday {
  const jsDay = new Date().getDay();
  return WEEKDAY_ORDER[(jsDay + 6) % 7] ?? "monday";
}

export function OpeningHoursTable({
  hours,
}: {
  hours: readonly OpeningHoursEntry[];
}) {
  if (hours.length === 0) return null;

  const byDay = new Map(hours.map((entry) => [entry.day, entry]));
  const today = currentWeekday();

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {WEEKDAY_ORDER.map((day) => {
          const entry = byDay.get(day);
          const isToday = day === today;
          return (
            <tr
              key={day}
              className={cn(
                "border-border/60 border-b last:border-0",
                isToday && "font-medium",
              )}
            >
              <th
                scope="row"
                className="text-muted-foreground w-32 py-1.5 pr-2 text-left font-normal"
              >
                <span className={cn(isToday && "text-foreground font-medium")}>
                  {WEEKDAY_LABELS[day]}
                </span>
              </th>
              <td className="py-1.5 text-right sm:text-left">
                {!entry || entry.closed || !entry.opens || !entry.closes
                  ? "Closed"
                  : `${entry.opens} – ${entry.closes}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
