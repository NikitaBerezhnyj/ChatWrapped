import type {
  TextWordsSlide as TextWordsSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./TextWordsSlide.module.css";

interface Props {
  slide: TextWordsSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextWordsSlide({ slide, formatters }: Props) {
  const words = [...slide.words]
    .filter(word => word.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const maxCount = Math.max(...words.map(word => word.count), 1);

  if (words.length === 0) {
    return (
      <section className={styles.slide}>
        <span className={layout.kicker}>THE LANGUAGE OF YOUR CHAT</span>

        <h2 className={layout.displayTitle}>
          Every chat
          <br />
          has its own
          <br />
          vocabulary.
        </h2>

        <p className={styles.emptyState}>Not enough word data to reveal your most used words.</p>

        <span className={layout.slideFootnote}>THE WORDS THAT SHAPED YOUR STORY</span>
      </section>
    );
  }

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE LANGUAGE OF YOUR CHAT</span>

      <h2 className={layout.displayTitle}>
        These words
        <br />
        kept coming
        <br />
        back.
      </h2>

      <div className={styles.wordCloud}>
        {words.map((word, index) => {
          const relativeFrequency = word.count / maxCount;

          return (
            <div
              className={`${styles.word} ${index === 0 ? styles.leadingWord : ""}`}
              key={word.word}
              style={{
                fontSize: `${Math.round(15 + relativeFrequency * 27)}px`,
                opacity: 0.55 + relativeFrequency * 0.45
              }}
            >
              <span className={styles.wordText}>{word.word}</span>
              <span className={styles.wordCount}>{formatters.formatCompactNumber(word.count)}</span>
            </div>
          );
        })}
      </div>

      <span className={layout.slideFootnote}>YOUR {words.length} MOST USED WORDS</span>
    </section>
  );
}
