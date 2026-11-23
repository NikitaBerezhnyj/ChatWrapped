import type {
  ConversationsMonologueSlide as ConversationsMonologueSlideData,
  PreparedPresentation
} from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./ConversationsMonologueSlide.module.css";

interface Props {
  slide: ConversationsMonologueSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsMonologueSlide({ slide, formatters }: Props) {
  const hasMonologue = slide.maxConsecutiveMessages > 0;

  return (
    <section className={`${layout.slide} ${styles.slide}`}>
      <span className={layout.kicker}>THE MONOLOGUE</span>

      <div className={styles.content}>
        {hasMonologue ? (
          <>
            <h2 className={styles.title}>
              Sometimes,
              <br />
              one message
              <br />
              led to another.
            </h2>

            <div className={styles.statistic}>
              <span className={styles.count}>
                {formatters.formatNumber(slide.maxConsecutiveMessages)}
              </span>

              <span className={styles.label}>MESSAGES IN A ROW</span>
            </div>

            <p className={styles.description}>
              The longest streak of messages sent by one person without interruption.
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              Every voice
              <br />
              found its moment.
            </h2>

            <p className={styles.emptyDescription}>
              There isn't enough message activity to identify a monologue.
            </p>
          </>
        )}
      </div>

      <div className={styles.decoration} aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <p className={layout.slideFootnote}>ONE VOICE, MESSAGE AFTER MESSAGE</p>
    </section>
  );
}
