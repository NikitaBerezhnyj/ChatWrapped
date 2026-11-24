import { toZonedTime } from "date-fns-tz";

export function getZonedDate(timestamp: number, timezone: string): Date {
  return toZonedTime(new Date(timestamp), timezone);
}
