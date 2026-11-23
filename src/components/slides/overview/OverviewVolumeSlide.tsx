import type {
  PreparedPresentation,
  OverviewVolumeSlide as OverviewVolumeSlideData
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./OverviewVolumeSlide.module.css";

interface Props {
  slide: OverviewVolumeSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewVolumeSlide({ slide, formatters }: Props) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE BIG PICTURE</span>

      <h2 className={layout.displayTitle}>
        A lot can happen
        <br />
        in a conversation.
      </h2>

      <div className={styles.heroMetric}>
        <strong>{formatters.formatCompactNumber(slide.totalMessages)}</strong>
        <span>MESSAGES EXCHANGED</span>
      </div>

      <div className={styles.metricGrid}>
        <div>
          <strong>{formatters.formatCompactNumber(slide.totalWords)}</strong>
          <span>WORDS</span>
        </div>

        <div>
          <strong>{formatters.formatCompactNumber(slide.totalCharacters)}</strong>
          <span>CHARACTERS</span>
        </div>

        <div>
          <strong>{formatters.formatNumber(slide.messagesWithText)}</strong>
          <span>TEXT MESSAGES</span>
        </div>

        <div>
          <strong>
            {formatters.formatPercentage(
              slide.totalMessages > 0 ? slide.messagesWithText / slide.totalMessages : 0
            )}
          </strong>
          <span>WITH TEXT</span>
        </div>
      </div>

      <span className={layout.slideFootnote}>THE NUMBERS BEHIND YOUR CHAT</span>
    </section>
  );
}
