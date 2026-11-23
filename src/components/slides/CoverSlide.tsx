import type { PreparedPresentation, CoverSlide as CoverSlideData } from "../../core/presentation";
import layout from "./SlideLayout.module.css";
import styles from "./CoverSlide.module.css";

interface CoverSlideProps {
  slide: CoverSlideData;
  chatTitle: string;
  formatters: PreparedPresentation["formatters"];
  onNext: () => void;
}

export function CoverSlide({ slide, chatTitle, formatters, onNext }: CoverSlideProps) {
  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>YOUR CONVERSATION, RECAP</span>

      <div className={styles.coverTitle}>
        <span>Every</span>
        <span className={styles.outlineText}>message.</span>
        <span>Every moment.</span>
      </div>

      <div className={styles.coverDetails}>
        <h1>{slide.chatTitle || chatTitle}</h1>
        <p>{formatters.formatDateRange(slide.period.start, slide.period.end)}</p>
        <p>{formatters.formatNumber(slide.participants.length)} participants</p>
      </div>

      <button className={styles.startButton} type="button" onClick={onNext}>
        LET'S GO <span>↗</span>
      </button>

      <div className={styles.coverGraphic} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
