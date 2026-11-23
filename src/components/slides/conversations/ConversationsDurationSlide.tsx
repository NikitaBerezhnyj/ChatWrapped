import type {
  ConversationsDurationSlide as ConversationsDurationSlideData,
  PreparedPresentation
} from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./ConversationsDurationSlide.module.css";

interface Props {
  slide: ConversationsDurationSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsDurationSlide({ slide, formatters }: Props) {
  const hasConversations = slide.averageDurationMs > 0;

  return (
    <section className={`${layout.slide} ${styles.slide}`}>
      <span className={layout.kicker}>CONVERSATION LENGTH</span>

      <div className={styles.content}>
        {hasConversations ? (
          <>
            <h2 className={styles.title}>
              Some talks
              <br />
              lasted longer
              <br />
              than others.
            </h2>

            <div className={styles.average}>
              <span className={styles.label}>AVERAGE CONVERSATION</span>
              <span className={styles.averageValue}>
                {formatters.formatDuration(slide.averageDurationMs)}
              </span>
            </div>

            <div className={styles.longest}>
              <span className={styles.longestLabel}>THE LONGEST ONE LASTED</span>
              <span className={styles.longestValue}>
                {formatters.formatDuration(slide.longestDurationMs)}
              </span>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              Every conversation
              <br />
              takes its own time.
            </h2>

            <p className={styles.emptyDescription}>
              There isn't enough conversation activity to calculate duration.
            </p>
          </>
        )}
      </div>

      <p className={layout.slideFootnote}>EVERY MINUTE IS PART OF THE STORY</p>
    </section>
  );
}
