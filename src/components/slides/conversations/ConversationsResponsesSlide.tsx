import type {
  ConversationsResponsesSlide as ConversationsResponsesSlideData,
  PreparedPresentation
} from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./ConversationsResponsesSlide.module.css";

interface Props {
  slide: ConversationsResponsesSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsResponsesSlide({ slide, formatters }: Props) {
  const hasResponseData = slide.averageResponseTimeMs > 0;

  return (
    <section className={`${layout.slide} ${styles.slide}`}>
      <span className={layout.kicker}>RESPONSE TIME</span>

      <div className={styles.content}>
        {hasResponseData ? (
          <>
            <h2 className={styles.title}>
              The conversation
              <br />
              kept moving.
            </h2>

            <div className={styles.average}>
              <span className={styles.label}>AVERAGE RESPONSE TIME</span>
              <span className={styles.averageValue}>
                {formatters.formatDuration(slide.averageResponseTimeMs)}
              </span>
            </div>

            <div className={styles.comparison}>
              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>FASTEST RESPONSE</span>
                <span className={styles.comparisonValue}>
                  {formatters.formatDuration(slide.fastestResponseTimeMs)}
                </span>
              </div>

              <div className={styles.divider} />

              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>LONGEST RESPONSE</span>
                <span className={styles.comparisonValue}>
                  {formatters.formatDuration(slide.longestResponseTimeMs)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              Some messages
              <br />
              never needed
              <br />a reply.
            </h2>

            <p className={styles.emptyDescription}>
              There isn't enough response data to calculate reply times.
            </p>
          </>
        )}
      </div>

      <p className={layout.slideFootnote}>EVERY REPLY HAS ITS OWN TIMING</p>
    </section>
  );
}
