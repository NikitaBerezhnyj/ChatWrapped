import type { PresentationSlideType } from "../types";
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
  formatWeekday(weekday: number): string;

  getSlideCopy(type: PresentationSlideType): SlideCopy;
}

export interface PresentationFormatterFactory {
  create(options?: Partial<PresentationFormattingOptions>): PresentationFormatters;
}
