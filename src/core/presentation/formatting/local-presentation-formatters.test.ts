import { describe, expect, it } from "vitest";
import type { PresentationSlideType } from "../types";
import { LocalPresentationFormatterFactory } from "./local-presentation-formatters";
import { DEFAULT_PRESENTATION_FORMATTING_OPTIONS } from "./presentation-formatting-options";

describe("LocalPresentationFormatterFactory", () => {
  const factory = new LocalPresentationFormatterFactory();
  const formatters = factory.create({ timezone: "UTC" });

  describe("formatNumber", () => {
    it("formats integers with thousand separators", () => {
      expect(formatters.formatNumber(1234567)).toBe("1,234,567");
    });

    it("formats decimal numbers", () => {
      expect(formatters.formatNumber(1234.56)).toBe("1,234.56");
    });

    it("formats zero", () => {
      expect(formatters.formatNumber(0)).toBe("0");
    });
  });

  describe("formatCompactNumber", () => {
    it("formats large numbers in compact notation", () => {
      expect(formatters.formatCompactNumber(12500)).toBe("12.5K");
    });

    it("does not compact small numbers", () => {
      expect(formatters.formatCompactNumber(500)).toBe("500");
    });
  });

  describe("formatPercentage", () => {
    it("formats decimal values as percentages", () => {
      expect(formatters.formatPercentage(0.75)).toBe("75%");
    });

    it("rounds percentages to whole numbers", () => {
      expect(formatters.formatPercentage(0.756)).toBe("76%");
    });

    it("formats zero", () => {
      expect(formatters.formatPercentage(0)).toBe("0%");
    });
  });

  describe("formatDuration", () => {
    it("formats seconds", () => {
      expect(formatters.formatDuration(5000)).toBe("5 seconds");
    });

    it("formats minutes and seconds", () => {
      expect(formatters.formatDuration(65_000)).toBe("1 minute 5 seconds");
    });

    it("formats hours and minutes", () => {
      expect(formatters.formatDuration(3_900_000)).toBe("1 hour 5 minutes");
    });

    it("formats days and hours", () => {
      expect(formatters.formatDuration(90_000_000)).toBe("1 day 1 hour");
    });

    it("returns zero seconds for zero duration", () => {
      expect(formatters.formatDuration(0)).toBe("0 seconds");
    });

    it("returns zero seconds for negative duration", () => {
      expect(formatters.formatDuration(-5000)).toBe("0 seconds");
    });

    it("ignores milliseconds", () => {
      expect(formatters.formatDuration(1999)).toBe("1 second");
    });

    it("displays at most two duration units", () => {
      const duration = 86_400_000 + 3_600_000 + 60_000;

      expect(formatters.formatDuration(duration)).toBe("1 day 1 hour");
    });
  });

  describe("formatDate", () => {
    it("formats timestamps using the configured timezone", () => {
      const timestamp = Date.UTC(2024, 0, 15, 12);

      expect(formatters.formatDate(timestamp)).toBe("Jan 15, 2024");
    });

    it("handles date changes caused by timezone differences", () => {
      const kyivFormatters = factory.create({
        timezone: "Europe/Kyiv"
      });

      const timestamp = Date.UTC(2024, 0, 1, 23, 30);

      expect(kyivFormatters.formatDate(timestamp)).toBe("Jan 2, 2024");
    });
  });

  describe("formatTime", () => {
    it("formats time in 12-hour notation", () => {
      const timestamp = Date.UTC(2024, 0, 1, 13, 5);

      expect(formatters.formatTime(timestamp)).toBe("01:05 PM");
    });

    it("formats midnight correctly", () => {
      const timestamp = Date.UTC(2024, 0, 1, 0, 0);

      expect(formatters.formatTime(timestamp)).toBe("12:00 AM");
    });
  });

  describe("formatDateTime", () => {
    it("formats date and time together", () => {
      const timestamp = Date.UTC(2024, 0, 1, 13, 5);

      expect(formatters.formatDateTime(timestamp)).toBe("Jan 1, 2024, 1:05 PM");
    });
  });

  describe("formatDateRange", () => {
    it("formats a date range", () => {
      const start = Date.UTC(2024, 0, 1);
      const end = Date.UTC(2024, 0, 15);

      expect(formatters.formatDateRange(start, end)).toBe("Jan 1, 2024 – Jan 15, 2024");
    });

    it("returns a fallback when the start is missing", () => {
      expect(formatters.formatDateRange(null, Date.UTC(2024, 0, 15))).toBe("No messages");
    });

    it("returns a fallback when the end is missing", () => {
      expect(formatters.formatDateRange(Date.UTC(2024, 0, 1), null)).toBe("No messages");
    });

    it("returns a fallback when both dates are missing", () => {
      expect(formatters.formatDateRange(null, null)).toBe("No messages");
    });
  });

  describe("formatHour", () => {
    it("formats morning hours", () => {
      expect(formatters.formatHour(9)).toBe("9 AM");
    });

    it("formats afternoon hours", () => {
      expect(formatters.formatHour(15)).toBe("3 PM");
    });

    it("formats midnight", () => {
      expect(formatters.formatHour(0)).toBe("12 AM");
    });

    it("formats noon", () => {
      expect(formatters.formatHour(12)).toBe("12 PM");
    });
  });

  describe("formatWeekday", () => {
    it("formats Sunday", () => {
      expect(formatters.formatWeekday(0)).toBe("Sunday");
    });

    it("formats Wednesday", () => {
      expect(formatters.formatWeekday(3)).toBe("Wednesday");
    });

    it("formats Saturday", () => {
      expect(formatters.formatWeekday(6)).toBe("Saturday");
    });

    it("formats a short weekday", () => {
      expect(formatters.formatWeekday(0, "short")).toBe("Sun");
    });
  });

  describe("formatDay", () => {
    it("formats a calendar day", () => {
      expect(formatters.formatDay("2024-01-15")).toBe("January 15, 2024");
    });

    it("returns the input when the day is invalid", () => {
      expect(formatters.formatDay("not-a-date")).toBe("not-a-date");
    });
  });

  describe("formatMonth", () => {
    it("formats a month with the year", () => {
      expect(formatters.formatMonth("2024-03")).toBe("March 2024");
    });

    it("formats a short month name", () => {
      expect(formatters.formatMonth("2024-03", "short")).toBe("Mar");
    });

    it("returns the input when the month is invalid", () => {
      expect(formatters.formatMonth("oops")).toBe("oops");
    });
  });

  describe("getSlideCopy", () => {
    const expectedCopy: Record<
      PresentationSlideType,
      {
        title: string;
        subtitle: string;
      }
    > = {
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

    it.each(Object.entries(expectedCopy))("returns correct copy for the %s slide", (type, copy) => {
      expect(formatters.getSlideCopy(type as PresentationSlideType)).toEqual(copy);
    });

    it("returns an independent copy of slide text", () => {
      const first = formatters.getSlideCopy("cover");
      const second = formatters.getSlideCopy("cover");

      expect(first).not.toBe(second);
      expect(first).toEqual(second);
    });
  });

  describe("create", () => {
    it("uses the default timezone when no options are provided", () => {
      const defaultFormatters = factory.create();
      const explicitFormatters = factory.create({
        timezone: DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone
      });
      const timestamp = Date.UTC(2024, 0, 1, 23, 30);

      expect(defaultFormatters.formatDate(timestamp)).toBe(
        explicitFormatters.formatDate(timestamp)
      );
    });

    it("supports a custom timezone", () => {
      const newYorkFormatters = factory.create({
        timezone: "America/New_York"
      });

      const timestamp = Date.UTC(2024, 0, 1, 2, 30);

      expect(newYorkFormatters.formatDate(timestamp)).toBe("Dec 31, 2023");
      expect(newYorkFormatters.formatTime(timestamp)).toBe("09:30 PM");
    });
  });
});
