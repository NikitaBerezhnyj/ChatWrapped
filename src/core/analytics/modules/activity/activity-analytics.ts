import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { NormalizedMessage } from "../../../normalization";
import type { ActivityStats, AnalysisOptions } from "../../types";

interface CountEntry {
  key: string;
  count: number;
}

function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortCountEntries(map: Map<string, number>): CountEntry[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.key.localeCompare(b.key);
    });
}

function getMostActive(entries: CountEntry[]): CountEntry | null {
  return entries[0] ?? null;
}

function getZonedDate(timestamp: number, timezone: string): Date {
  return toZonedTime(new Date(timestamp), timezone);
}

function getLongestActiveStreak(messages: NormalizedMessage[], timezone: string): number {
  if (messages.length === 0) {
    return 0;
  }

  const activeDates = new Set(
    messages.map(message => format(getZonedDate(message.timestamp, timezone), "yyyy-MM-dd"))
  );

  const sortedDates = [...activeDates].sort();

  let longestStreak = 1;
  let currentStreak = 1;

  for (let index = 1; index < sortedDates.length; index += 1) {
    const previous = new Date(sortedDates[index - 1]);
    const current = new Date(sortedDates[index]);

    const differenceDays = (current.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000);

    currentStreak = differenceDays === 1 ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  return longestStreak;
}

function getLongestGap(messages: NormalizedMessage[]): number {
  if (messages.length < 2) {
    return 0;
  }

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  let longestGap = 0;

  for (let index = 1; index < sortedMessages.length; index += 1) {
    const gap = sortedMessages[index].timestamp - sortedMessages[index - 1].timestamp;

    longestGap = Math.max(longestGap, gap);
  }

  return longestGap;
}

export function analyzeActivity(
  messages: NormalizedMessage[],
  options: AnalysisOptions
): ActivityStats {
  if (messages.length === 0) {
    return {
      byDay: [],
      byMonth: [],
      byHour: [],
      byWeekday: [],
      mostActiveDay: null,
      mostActiveMonth: null,
      mostActiveHour: null,
      mostActiveWeekday: null,
      longestActiveStreak: 0,
      longestGapMs: 0
    };
  }

  const byDayMap = new Map<string, number>();
  const byMonthMap = new Map<string, number>();
  const byHourMap = new Map<string, number>();
  const byWeekdayMap = new Map<string, number>();

  for (const message of messages) {
    const date = getZonedDate(message.timestamp, options.timezone);

    incrementCount(byDayMap, format(date, "yyyy-MM-dd"));
    incrementCount(byMonthMap, format(date, "yyyy-MM"));
    incrementCount(byHourMap, String(date.getHours()));
    incrementCount(byWeekdayMap, String(date.getDay()));
  }

  const dayEntries = sortCountEntries(byDayMap);
  const monthEntries = sortCountEntries(byMonthMap);
  const hourEntries = sortCountEntries(byHourMap);
  const weekdayEntries = sortCountEntries(byWeekdayMap);

  const mostActiveDay = getMostActive(dayEntries);
  const mostActiveMonth = getMostActive(monthEntries);
  const mostActiveHour = getMostActive(hourEntries);
  const mostActiveWeekday = getMostActive(weekdayEntries);

  return {
    byDay: dayEntries
      .map(({ key, count }) => ({
        date: key,
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),

    byMonth: monthEntries
      .map(({ key, count }) => ({
        month: key,
        count
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),

    byHour: hourEntries
      .map(({ key, count }) => ({
        hour: Number(key),
        count
      }))
      .sort((a, b) => a.hour - b.hour),

    byWeekday: weekdayEntries
      .map(({ key, count }) => ({
        weekday: Number(key),
        count
      }))
      .sort((a, b) => a.weekday - b.weekday),

    mostActiveDay: mostActiveDay ? { date: mostActiveDay.key, count: mostActiveDay.count } : null,

    mostActiveMonth: mostActiveMonth
      ? { month: mostActiveMonth.key, count: mostActiveMonth.count }
      : null,

    mostActiveHour: mostActiveHour
      ? { hour: Number(mostActiveHour.key), count: mostActiveHour.count }
      : null,

    mostActiveWeekday: mostActiveWeekday
      ? {
          weekday: Number(mostActiveWeekday.key),
          count: mostActiveWeekday.count
        }
      : null,

    longestActiveStreak: getLongestActiveStreak(messages, options.timezone),

    longestGapMs: getLongestGap(messages)
  };
}
