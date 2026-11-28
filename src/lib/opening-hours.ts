import type { OpeningHoursEntry } from "@/lib/schemas/common";

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export interface OpenStatus {
  open: boolean;
  /** HH:mm the current (if open) or next (if closed) period starts/ends. */
  time?: string;
}

/** The current weekday/time in the UK, regardless of the server's own timezone. */
function nowInLondon(now: Date): {
  day: (typeof WEEKDAYS)[number];
  time: string;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekday =
    parts.find((p) => p.type === "weekday")?.value.toLowerCase() ?? "monday";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { day: weekday as (typeof WEEKDAYS)[number], time: `${hour}:${minute}` };
}

/**
 * Whether a place is open right now, London time — a day with no entry at
 * all (or `closed: true`) is treated as closed. Used to surface a live
 * open/closed signal on organization cards and profiles.
 */
export function getOpenStatus(
  openingHours: readonly OpeningHoursEntry[],
  now: Date = new Date(),
): OpenStatus {
  if (openingHours.length === 0) return { open: false };

  const { day, time } = nowInLondon(now);
  const today = openingHours.find((entry) => entry.day === day);

  if (
    today &&
    !today.closed &&
    today.opens &&
    today.closes &&
    time >= today.opens &&
    time < today.closes
  ) {
    return { open: true, time: today.closes };
  }

  const todayIndex = WEEKDAYS.indexOf(day);
  for (let offset = 0; offset < 7; offset++) {
    const candidate = WEEKDAYS[(todayIndex + offset) % 7];
    const entry = openingHours.find((e) => e.day === candidate);
    if (entry && !entry.closed && entry.opens) {
      if (offset === 0 && entry.opens <= time) continue;
      return { open: false, time: entry.opens };
    }
  }
  return { open: false };
}
