import type {
  TextRepeatedSlide as TextRepeatedSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./TextRepeatedSlide.module.css";

interface Props {
  slide: TextRepeatedSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextRepeatedSlide({ slide, formatters }: Props) {
  const repetitionCount = slide.repetitionCount;
  const hasRepetitions = repetitionCount > 0;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>SOME THINGS BEAR REPEATING</span>

      <div className={styles.content}>
        <h2 className={layout.displayTitle}>
          Once was
          <br />
          never
          <br />
          enough.
        </h2>

        {hasRepetitions ? (
          <div className={styles.metric}>
            <strong>{formatters.formatNumber(repetitionCount)}</strong>
            <span>REPETITIONS OF THE MOST REPEATED MESSAGE</span>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>Nothing on repeat.</strong>
            <span>Every message had its own moment.</span>
          </div>
        )}
      </div>

      <div className={styles.repeatVisual} aria-hidden="true">
        <span>REPEAT</span>
        <span>REPEAT</span>
        <span>REPEAT</span>
      </div>

      <span className={layout.slideFootnote}>THE MESSAGE THAT KEPT COMING BACK</span>
    </section>
  );
}
