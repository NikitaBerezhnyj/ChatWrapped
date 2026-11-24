import type { PresentationFormattingOptions } from "./presentation-formatting-options";

export interface SlideCopy {
  title: string;
  subtitle: string;
}

export interface PresentationFormatters {
  formatNumber(value: number): string;
  formatCompactNumber(value: number): string;
  formatPercentage(value: number): string;

  formatDuration(milliseconds: number): string;

  formatDate(timestamp: number): string;
  formatTime(timestamp: number): string;
  formatDateTime(timestamp: number): string;
  formatDateRange(start: number | null, end: number | null): string;

  formatHour(hour: number): string;
  formatWeekday(weekday: number, style?: "long" | "short"): string;

  formatDay(date: string): string;

  formatMonth(month: string, style?: "long" | "short"): string;
}

export interface PresentationFormatterFactory {
  create(options?: Partial<PresentationFormattingOptions>): PresentationFormatters;
}
