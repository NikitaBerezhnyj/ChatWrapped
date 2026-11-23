import type {
  ActivitySilenceSlide as ActivitySilenceSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ActivitySilenceSlide.module.css";

interface Props {
  slide: ActivitySilenceSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivitySilenceSlide({ slide, formatters }: Props) {
  const hasGap = slide.longestGapMs > 0;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>EVEN CONVERSATIONS NEED A BREAK</span>

      <div className={styles.content}>
        <h2 className={layout.displayTitle}>
          And then
          <br />
          there was
          <br />
          silence.
        </h2>

        {hasGap ? (
          <div className={styles.gapMetric}>
            <span className={styles.metricLabel}>THE LONGEST PAUSE</span>

            <strong>{formatters.formatDuration(slide.longestGapMs)}</strong>

            <span className={styles.metricCaption}>BETWEEN TWO MESSAGES</span>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>No silence recorded.</strong>
            <span>This conversation kept moving.</span>
          </div>
        )}
      </div>

      <div className={styles.pauseMark} aria-hidden="true">
        <span />
        <span />
      </div>

      <span className={layout.slideFootnote}>THE LONGEST GAP IN YOUR CHAT</span>
    </section>
  );
}
