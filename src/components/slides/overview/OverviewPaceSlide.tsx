import type {
  PreparedPresentation,
  OverviewPaceSlide as OverviewPaceSlideData
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./OverviewPaceSlide.module.css";

interface Props {
  slide: OverviewPaceSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewPaceSlide({ slide, formatters }: Props) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE CONVERSATION'S PACE</span>

      <h2 className={layout.displayTitle}>
        Some chats
        <br />
        never slow down.
      </h2>

      <div className={styles.paceMetrics}>
        <div className={styles.paceMetricPrimary}>
          <strong>{formatters.formatNumber(Math.round(slide.averageMessagesPerActiveDay))}</strong>
          <span>MESSAGES PER ACTIVE DAY</span>
        </div>

        <div className={styles.paceMetric}>
          <strong>
            {formatters.formatNumber(Number(slide.averageWordsPerMessage.toFixed(1)))}
          </strong>
          <span>WORDS PER MESSAGE</span>
        </div>

        <div className={styles.paceMetric}>
          <strong>{formatters.formatNumber(Math.round(slide.averageCharactersPerMessage))}</strong>
          <span>CHARACTERS PER MESSAGE</span>
        </div>
      </div>
    </section>
  );
}
