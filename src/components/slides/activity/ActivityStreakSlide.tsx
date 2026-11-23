import type {
  ActivityStreakSlide as ActivityStreakSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ActivityStreakSlide.module.css";

interface Props {
  slide: ActivityStreakSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivityStreakSlide({ slide, formatters }: Props) {
  const streak = slide.longestActiveStreak;
  const hasStreak = streak > 0;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>YOU KEPT THE CONVERSATION GOING</span>

      <div className={styles.content}>
        <div className={styles.titleGroup}>
          <h2 className={layout.displayTitle}>
            Some things
            <br />
            just keep
            <br />
            going.
          </h2>

          <span className={styles.outlineText}>IN A ROW</span>
        </div>

        {hasStreak ? (
          <div className={styles.streakMetric}>
            <strong>{formatters.formatNumber(streak)}</strong>
            <div className={styles.metricLabel}>
              <span>{streak === 1 ? "DAY" : "DAYS"}</span>
              <span>OF CONVERSATION</span>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>No streak recorded.</strong>
            <span>Every conversation has its own pace.</span>
          </div>
        )}
      </div>

      <div className={styles.bottomMark} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <span className={layout.slideFootnote}>YOUR LONGEST ACTIVE STREAK</span>
    </section>
  );
}
