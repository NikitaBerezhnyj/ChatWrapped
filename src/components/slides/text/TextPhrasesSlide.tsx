import type {
  TextPhrasesSlide as TextPhrasesSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./TextPhrasesSlide.module.css";

interface Props {
  slide: TextPhrasesSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextPhrasesSlide({ slide, formatters }: Props) {
  const phrases = [...slide.phrases]
    .filter(phrase => phrase.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (phrases.length === 0) {
    return (
      <section className={styles.slide}>
        <span className={layout.kicker}>THE PHRASES YOU REPEATED</span>

        <h2 className={layout.displayTitle}>
          Some words
          <br />
          just belong
          <br />
          together.
        </h2>

        <p className={styles.emptyState}>
          Not enough phrase data to reveal your recurring expressions.
        </p>

        <span className={layout.slideFootnote}>YOUR CONVERSATION, IN ITS OWN WORDS</span>
      </section>
    );
  }

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE PHRASES YOU REPEATED</span>

      <h2 className={layout.displayTitle}>
        Some things
        <br />
        were said
        <br />
        again.
      </h2>

      <div className={styles.phraseList}>
        {phrases.map((phrase, index) => (
          <div
            className={`${styles.phrase} ${index === 0 ? styles.leadingPhrase : ""}`}
            key={phrase.phrase}
          >
            <div className={styles.phraseContent}>
              <span className={styles.phraseText}>“{phrase.phrase}”</span>

              <span className={styles.phraseCount}>{formatters.formatNumber(phrase.count)}×</span>
            </div>

            {index !== phrases.length - 1 && <span className={styles.separator} />}
          </div>
        ))}
      </div>

      <span className={layout.slideFootnote}>{phrases.length} RECURRING EXPRESSIONS</span>
    </section>
  );
}
