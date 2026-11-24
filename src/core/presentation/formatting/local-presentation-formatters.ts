import type { PresentationSlideType } from "../types";
import type {
  PresentationFormatterFactory,
  PresentationFormatters,
  SlideCopy
} from "./presentation-formatters";
import {
  DEFAULT_PRESENTATION_FORMATTING_OPTIONS,
  type PresentationFormattingOptions
} from "./presentation-formatting-options";

const SLIDE_COPY: Record<PresentationSlideType, SlideCopy> = {
  cover: {
    title: "Your conversation",
    subtitle: "A story told through messages"
  },
  overview: {
    title: "The big picture",
    subtitle: "Your conversation in numbers"
  },
  activity: {
    title: "When you talked",
    subtitle: "A look at your conversation habits"
  },
  participants: {
    title: "Who's behind the messages?",
    subtitle: "A comparison of conversation participants"
  },
  text: {
    title: "The language of your conversation",
    subtitle: "Words, phrases and emojis that stood out"
  },
  conversations: {
    title: "Every conversation counts",
    subtitle: "How your conversations unfolded"
  },
  achievements: {
    title: "Your achievements",
    subtitle: "Milestones from your conversation"
  },
  finale: {
    title: "That's a wrap",
    subtitle: "Every message made this story"
  }
};

const EMPTY_DATE_RANGE = "No messages";

const DURATION_UNITS = [
  { unit: "day", milliseconds: 86_400_000 },
  { unit: "hour", milliseconds: 3_600_000 },
  { unit: "minute", milliseconds: 60_000 },
  { unit: "second", milliseconds: 1_000 }
] as const;

function parseCalendarDate(value: string): Date | null {
  const date = new Date(`${value}T12:00:00Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

export class LocalPresentationFormatterFactory implements PresentationFormatterFactory {
  create(options: Partial<PresentationFormattingOptions> = {}): PresentationFormatters {
    const resolvedOptions = {
      ...DEFAULT_PRESENTATION_FORMATTING_OPTIONS,
      ...options
    };

    const locale = "en-US";
    const { timezone } = resolvedOptions;

    const numberFormatter = new Intl.NumberFormat(locale);

    const compactNumberFormatter = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1
    });

    const percentageFormatter = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 0
    });

    const dateFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: timezone
    });

    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone
    });

    const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone
    });

    const dayFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC"
    });

    const longMonthFormatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });

    const shortMonthFormatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      timeZone: "UTC"
    });

    const durationFormatters = DURATION_UNITS.map(
      ({ unit }) =>
        new Intl.NumberFormat(locale, {
          style: "unit",
          unit,
          unitDisplay: "long"
        })
    );

    return {
      formatNumber(value) {
        return numberFormatter.format(value);
      },

      formatCompactNumber(value) {
        return compactNumberFormatter.format(value);
      },

      formatPercentage(value) {
        return percentageFormatter.format(value);
      },

      formatDuration(milliseconds) {
        let remaining = Math.max(0, Math.floor(milliseconds / 1000) * 1000);

        const parts: string[] = [];

        for (const [index, { milliseconds: unitMs }] of DURATION_UNITS.entries()) {
          const amount = Math.floor(remaining / unitMs);

          remaining %= unitMs;

          if (amount > 0) {
            parts.push(durationFormatters[index].format(amount));
          }

          if (parts.length === 2) {
            break;
          }
        }

        if (parts.length === 0) {
          return durationFormatters[3].format(0);
        }

        return parts.join(" ");
      },

      formatDate(timestamp) {
        return dateFormatter.format(timestamp);
      },

      formatTime(timestamp) {
        return timeFormatter.format(timestamp);
      },

      formatDateTime(timestamp) {
        return dateTimeFormatter.format(timestamp);
      },

      formatDateRange(start, end) {
        if (start === null || end === null) {
          return EMPTY_DATE_RANGE;
        }

        return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
      },

      formatHour(hour) {
        const date = new Date(Date.UTC(2024, 0, 1, hour));

        return new Intl.DateTimeFormat(locale, {
          hour: "numeric",
          timeZone: "UTC"
        }).format(date);
      },

      formatWeekday(weekday, style = "long") {
        const date = new Date(Date.UTC(2024, 0, 7 + weekday));

        return new Intl.DateTimeFormat(locale, {
          weekday: style,
          timeZone: "UTC"
        }).format(date);
      },

      formatDay(value) {
        const date = parseCalendarDate(value);

        return date ? dayFormatter.format(date) : value;
      },

      formatMonth(value, style = "long") {
        const date = parseCalendarDate(`${value}-01`);

        if (!date) {
          return value;
        }

        return (style === "long" ? longMonthFormatter : shortMonthFormatter).format(date);
      },

      getSlideCopy(type) {
        return { ...SLIDE_COPY[type] };
      }
    };
  }
}
