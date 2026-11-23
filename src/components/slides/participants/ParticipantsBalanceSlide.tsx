import type {
  ParticipantsBalanceSlide as ParticipantsBalanceSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ParticipantsBalanceSlide.module.css";

interface Props {
  slide: ParticipantsBalanceSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ParticipantsBalanceSlide({ slide, formatters }: Props) {
  const participants = [...slide.participants].sort((a, b) => b.messageCount - a.messageCount);

  const totalMessages = participants.reduce(
    (total, participant) => total + participant.messageCount,
    0
  );

  const hasMessages = totalMessages > 0;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>THE PEOPLE BEHIND THE MESSAGES</span>

      <h2 className={layout.displayTitle}>
        Every person
        <br />
        made this
        <br />
        conversation.
      </h2>

      <div className={styles.summary}>
        <strong>{formatters.formatNumber(participants.length)}</strong>
        <span>{participants.length === 1 ? "PARTICIPANT" : "PARTICIPANTS"}</span>
      </div>

      {participants.length > 0 ? (
        <div className={styles.participantList}>
          {participants.map((participant, index) => (
            <div className={styles.participant} key={participant.id}>
              <div className={styles.participantHeader}>
                <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>

                <span className={styles.name} title={participant.name}>
                  {participant.name}
                </span>

                <span className={styles.share}>
                  {formatters.formatPercentage(participant.messageShare)}
                </span>
              </div>

              <div className={styles.barTrack}>
                <span
                  className={styles.bar}
                  style={{
                    width: hasMessages
                      ? `${Math.max(0, Math.min(100, participant.messageShare * 100))}%`
                      : "0%"
                  }}
                />
              </div>

              <span className={styles.messageCount}>
                {formatters.formatNumber(participant.messageCount)} messages
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No participants found.</p>
      )}

      <span className={layout.slideFootnote}>
        {formatters.formatNumber(totalMessages)} MESSAGES, ONE SHARED STORY
      </span>
    </section>
  );
}
