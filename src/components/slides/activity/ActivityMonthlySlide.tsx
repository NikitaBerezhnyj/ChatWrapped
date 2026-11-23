import layout from "../SlideLayout.module.css";
import styles from "./ActivityMonthlySlide.module.css";
import type {
  PreparedPresentation,
  ActivityMonthlySlide as ActivityMonthlySlideData
} from "../../../core/presentation";

interface Props {
  slide: ActivityMonthlySlideData;
  formatters: PreparedPresentation["formatters"];
}

function formatMonth(month: string): {
  label: string;
  year: string;
} {
  const date = new Date(`${month}-01T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return { label: month, year: "" };
  }

  return {
    label: new Intl.DateTimeFormat("en-US", {
      month: "short"
    }).format(date),
    year: new Intl.DateTimeFormat("en-US", {
      year: "numeric"
    }).format(date)
  };
}

export function ActivityMonthlySlide({ slide, formatters }: Props) {
  const months = slide.byMonth;
  const maxCount = Math.max(...months.map(item => item.count), 1);

  const peakMonth = months.reduce(
    (peak, item) => (item.count > peak.count ? item : peak),
    months[0]
  );

  const hasActivity = months.some(item => item.count > 0);

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>A YEAR IN CONVERSATION</span>

      <h2 className={layout.displayTitle}>
        The months
        <br />
        that brought
        <br />
        you closer.
      </h2>

      {hasActivity ? (
        <>
          <div className={styles.peakSummary}>
            <span className={styles.summaryLabel}>YOUR MOST ACTIVE MONTH</span>
            <strong>
              {formatMonth(peakMonth.month).label} {formatMonth(peakMonth.month).year}
            </strong>
            <span className={styles.summaryCount}>
              {formatters.formatNumber(peakMonth.count)} messages
            </span>
          </div>

          <div
            className={styles.chart}
            role="img"
            aria-label={`Monthly message activity. Most active month: ${formatMonth(peakMonth.month).label} ${formatMonth(peakMonth.month).year}, with ${formatters.formatNumber(peakMonth.count)} messages.`}
          >
            {months.map(item => {
              const month = formatMonth(item.month);
              const isPeak = item.month === peakMonth.month;

              return (
                <div className={styles.monthColumn} key={item.month}>
                  <div className={styles.barTrack}>
                    <span
                      className={`${styles.bar} ${isPeak ? styles.peakBar : ""}`}
                      style={{
                        height: `${(item.count / maxCount) * 100}%`
                      }}
                    />
                  </div>

                  <span className={styles.monthLabel}>{month.label}</span>
                  <span className={styles.yearLabel}>{month.year}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.chartCaption}>
            <span>MESSAGE ACTIVITY</span>
            <span>{months.length} MONTHS</span>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <strong>No monthly history yet.</strong>
          <span>There is not enough activity to build a timeline.</span>
        </div>
      )}

      <span className={layout.slideFootnote}>EVERY MONTH ADDED ANOTHER CHAPTER</span>
    </section>
  );
}
