import type {
  ActivityRhythmSlide as ActivityRhythmSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ActivityRhythmSlide.module.css";

interface Props {
  slide: ActivityRhythmSlideData;
  formatters: PreparedPresentation["formatters"];
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatHour(hour: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true
  }).format(new Date(2024, 0, 1, hour));
}

export function ActivityRhythmSlide({ slide, formatters }: Props) {
  // The analytics layer uses JavaScript weekday indexing: Sunday = 0.
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: slide.byHour.find(item => item.hour === hour)?.count ?? 0
  }));

  const weekdays = WEEKDAYS.map((label, weekday) => ({
    label,
    weekday,
    count: slide.byWeekday.find(item => item.weekday === weekday)?.count ?? 0
  }));

  const maxHourCount = Math.max(...hours.map(item => item.count), 1);
  const maxWeekdayCount = Math.max(...weekdays.map(item => item.count), 1);

  const peakHour = hours.reduce((peak, item) => (item.count > peak.count ? item : peak), hours[0]);

  const peakWeekday = weekdays.reduce(
    (peak, item) => (item.count > peak.count ? item : peak),
    weekdays[0]
  );

  const hasActivity = hours.some(item => item.count > 0);

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE RHYTHM OF YOUR CHAT</span>

      <h2 className={layout.displayTitle}>
        Every hour
        <br />
        has its own
        <br />
        story.
      </h2>

      <div className={styles.chartSection}>
        <div className={styles.chartHeading}>
          <span>BY HOUR</span>
          {hasActivity && <strong>PEAK AT {formatHour(peakHour.hour)}</strong>}
        </div>

        {hasActivity ? (
          <>
            <div
              className={styles.hourChart}
              role="img"
              aria-label={`Messages by hour. Peak hour: ${formatHour(peakHour.hour)} with ${formatters.formatNumber(peakHour.count)} messages.`}
            >
              {hours.map(item => (
                <div className={styles.hourColumn} key={item.hour}>
                  <div className={styles.hourBarTrack}>
                    <span
                      className={`${styles.hourBar} ${
                        item.hour === peakHour.hour ? styles.peakBar : ""
                      }`}
                      style={{
                        height: `${(item.count / maxHourCount) * 100}%`
                      }}
                    />
                  </div>
                  {item.hour % 3 === 0 && (
                    <span className={styles.hourLabel}>{formatHour(item.hour)}</span>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.chartLegend}>
              <span>12 AM</span>
              <span>12 PM</span>
              <span>11 PM</span>
            </div>
          </>
        ) : (
          <p className={styles.emptyState}>Not enough activity data yet.</p>
        )}
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeading}>
          <span>BY WEEKDAY</span>
          {hasActivity && <strong>PEAK ON {peakWeekday.label}</strong>}
        </div>

        {hasActivity ? (
          <div
            className={styles.weekdayChart}
            role="img"
            aria-label={`Messages by weekday. Peak day: ${peakWeekday.label} with ${formatters.formatNumber(peakWeekday.count)} messages.`}
          >
            {weekdays.map(item => (
              <div className={styles.weekdayColumn} key={item.weekday}>
                <div className={styles.weekdayBarTrack}>
                  <span
                    className={`${styles.weekdayBar} ${
                      item.weekday === peakWeekday.weekday ? styles.peakBar : ""
                    }`}
                    style={{
                      height: `${(item.count / maxWeekdayCount) * 100}%`
                    }}
                  />
                </div>
                <span className={styles.weekdayLabel}>{item.label}</span>
                <span className={styles.weekdayCount}>
                  {formatters.formatCompactNumber(item.count)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Not enough activity data yet.</p>
        )}
      </div>

      <span className={layout.slideFootnote}>EVERY CONVERSATION HAS A RHYTHM</span>
    </section>
  );
}
