import type { PreparedPresentation, FinaleSlide as FinaleSlideData } from "../../core/presentation";
import layout from "./SlideLayout.module.css";
import styles from "./FinaleSlide.module.css";

interface Props {
  slide: FinaleSlideData;
  formatters: PreparedPresentation["formatters"];
  onReplay: () => void;
}

export function FinaleSlide({ slide, formatters, onReplay }: Props) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>CHAT WRAPPED</span>

      <div className={styles.finaleHeading}>
        <span>And that's</span>
        <span className={styles.outlineText}>a wrap.</span>
      </div>

      <p className={styles.finaleChatTitle}>{slide.chatTitle}</p>

      <div className={styles.finaleStats}>
        <div>
          <strong>{formatters.formatCompactNumber(slide.totalMessages)}</strong>
          <span>MESSAGES</span>
        </div>

        <div>
          <strong>{formatters.formatCompactNumber(slide.totalWords)}</strong>
          <span>WORDS</span>
        </div>

        <div>
          <strong>{formatters.formatNumber(slide.totalParticipants)}</strong>
          <span>PARTICIPANTS</span>
        </div>

        <div>
          <strong>{formatters.formatNumber(slide.activeDays)}</strong>
          <span>ACTIVE DAYS</span>
        </div>
      </div>

      <div className={styles.finaleActions}>
        <button className={styles.finaleReplayButton} type="button" onClick={onReplay}>
          ↻ REPLAY STORY
        </button>
      </div>

      <span className={styles.finaleBrand}>YOUR STORY. YOUR NUMBERS.</span>
    </section>
  );
}
