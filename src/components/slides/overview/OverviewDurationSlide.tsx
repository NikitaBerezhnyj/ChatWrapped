import type {
  PreparedPresentation,
  OverviewDurationSlide as OverviewDurationSlideData
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./OverviewDurationSlide.module.css";

interface Props {
  slide: OverviewDurationSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewDurationSlide({ slide, formatters }: Props) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>TIME WELL SPENT</span>

      <h2 className={layout.displayTitle}>
        This conversation
        <br />
        has been around.
      </h2>

      <div className={styles.durationHighlight}>
        <strong>{formatters.formatDuration(slide.durationMs)}</strong>
        <span>FROM FIRST MESSAGE TO LAST</span>
      </div>

      <div className={styles.durationFooter}>
        <strong>{formatters.formatNumber(slide.activeDays)}</strong>
        <span>ACTIVE DAYS</span>
      </div>

      <span className={layout.slideFootnote}>
        {formatters.formatDateRange(slide.period.start, slide.period.end)}
      </span>
    </section>
  );
}
