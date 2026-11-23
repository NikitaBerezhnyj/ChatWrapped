import type {
  ConversationsOverviewSlide as ConversationsOverviewSlideData,
  PreparedPresentation
} from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./ConversationsOverviewSlide.module.css";

interface Props {
  slide: ConversationsOverviewSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsOverviewSlide({ slide, formatters }: Props) {
  const hasConversations = slide.totalConversations > 0;

  return (
    <section
      className={layout.slide}
      style={
        {
          "--slide-background": "var(--slide-conversations-background)"
        } as React.CSSProperties
      }
    >
      <span className={layout.kicker}>CONVERSATIONS</span>

      <div className={styles.content}>
        {hasConversations ? (
          <>
            <h2 className={styles.title}>
              Every conversation
              <br />
              had a beginning.
            </h2>

            <div className={styles.statistic}>
              <span className={styles.count}>
                {formatters.formatNumber(slide.totalConversations)}
              </span>

              <span className={styles.label}>
                {slide.totalConversations === 1 ? "CONVERSATION" : "CONVERSATIONS"}
              </span>
            </div>

            <p className={styles.description}>
              Separate conversations, each with its own beginning and end.
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              Not every story
              <br />
              becomes a conversation.
            </h2>

            <div className={styles.statistic}>
              <span className={styles.count}>0</span>
              <span className={styles.label}>CONVERSATIONS</span>
            </div>

            <p className={styles.description}>
              We couldn't identify any separate conversations in this chat.
            </p>
          </>
        )}
      </div>

      <div className={styles.decoration} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <p className={layout.slideFootnote}>A CLOSER LOOK AT YOUR CONVERSATIONS</p>
    </section>
  );
}
