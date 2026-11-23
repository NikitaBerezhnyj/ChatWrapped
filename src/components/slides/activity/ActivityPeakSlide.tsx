import type {
  ActivityPeakSlide as ActivityPeakSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ActivityPeakSlide.module.css";

interface Props {
  slide: ActivityPeakSlideData;
  formatters: PreparedPresentation["formatters"];
}

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(parsedDate);
}

function formatMonth(month: string): string {
  const parsedDate = new Date(`${month}-01T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return month;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(parsedDate);
}

function formatHour(hour: number): string {
  const date = new Date(2024, 0, 1, hour);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true
  }).format(date);
}

function formatWeekday(weekday: number): string {
  const date = new Date(2024, 0, 7 + weekday);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long"
  }).format(date);
}

export function ActivityPeakSlide({ slide, formatters }: Props) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>WHEN YOU WERE MOST ALIVE</span>

      <h2 className={layout.displayTitle}>
        One day
        <br />
        stood above
        <br />
        the rest.
      </h2>

      <div className={styles.heroMetric}>
        <strong>
          {slide.mostActiveDay ? formatters.formatNumber(slide.mostActiveDay.count) : "—"}
        </strong>
        <span>MESSAGES IN ONE DAY</span>
      </div>

      <div className={styles.peakDate}>
        {slide.mostActiveDay ? formatDate(slide.mostActiveDay.date) : "No activity data"}
      </div>

      <div className={styles.peakGrid}>
        <div className={styles.peakItem}>
          <span className={styles.peakLabel}>TOP MONTH</span>
          <strong>{slide.mostActiveMonth ? formatMonth(slide.mostActiveMonth.month) : "—"}</strong>
          {slide.mostActiveMonth && (
            <span className={styles.peakCount}>
              {formatters.formatNumber(slide.mostActiveMonth.count)} messages
            </span>
          )}
        </div>

        <div className={styles.peakItem}>
          <span className={styles.peakLabel}>TOP HOUR</span>
          <strong>{slide.mostActiveHour ? formatHour(slide.mostActiveHour.hour) : "—"}</strong>
          {slide.mostActiveHour && (
            <span className={styles.peakCount}>
              {formatters.formatNumber(slide.mostActiveHour.count)} messages
            </span>
          )}
        </div>

        <div className={styles.peakItem}>
          <span className={styles.peakLabel}>TOP WEEKDAY</span>
          <strong>
            {slide.mostActiveWeekday ? formatWeekday(slide.mostActiveWeekday.weekday) : "—"}
          </strong>
          {slide.mostActiveWeekday && (
            <span className={styles.peakCount}>
              {formatters.formatNumber(slide.mostActiveWeekday.count)} messages
            </span>
          )}
        </div>
      </div>

      <span className={layout.slideFootnote}>YOUR CHAT'S BUSIEST MOMENTS</span>
    </section>
  );
}
