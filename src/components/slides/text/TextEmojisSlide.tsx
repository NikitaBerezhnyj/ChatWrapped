import type {
  TextEmojisSlide as TextEmojisSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./TextEmojisSlide.module.css";

interface Props {
  slide: TextEmojisSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextEmojisSlide({ slide, formatters }: Props) {
  const emojis = [...slide.emojis]
    .filter(emoji => emoji.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (emojis.length === 0) {
    return (
      <section className={styles.slide}>
        <span className={layout.kicker}>A LANGUAGE OF THEIR OWN</span>

        <h2 className={layout.displayTitle}>
          Not every
          <br />
          feeling needs
          <br />a word.
        </h2>

        <p className={styles.emptyState}>No recurring emojis found in this conversation.</p>

        <span className={layout.slideFootnote}>SOME THINGS ARE BETTER LEFT UNSAID</span>
      </section>
    );
  }

  const [leadingEmoji, ...otherEmojis] = emojis;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>A LANGUAGE OF THEIR OWN</span>

      <h2 className={layout.displayTitle}>
        More than
        <br />
        words could
        <br />
        ever say.
      </h2>

      <div className={styles.leadingEmoji}>
        <span className={styles.emoji}>{leadingEmoji.emoji}</span>

        <div className={styles.leadingInfo}>
          <strong>{formatters.formatNumber(leadingEmoji.count)}</strong>
          <span>USES OF YOUR TOP EMOJI</span>
        </div>
      </div>

      {otherEmojis.length > 0 && (
        <div className={styles.emojiGrid}>
          {otherEmojis.map(item => (
            <div className={styles.emojiItem} key={item.emoji}>
              <span className={styles.gridEmoji}>{item.emoji}</span>
              <span className={styles.emojiCount}>
                {formatters.formatCompactNumber(item.count)}
              </span>
            </div>
          ))}
        </div>
      )}

      <span className={layout.slideFootnote}>YOUR MOST USED EMOJIS</span>
    </section>
  );
}
