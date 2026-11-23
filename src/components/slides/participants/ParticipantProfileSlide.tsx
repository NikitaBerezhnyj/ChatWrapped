import type {
  ParticipantProfileSlide as ParticipantProfileSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import layout from "../SlideLayout.module.css";
import styles from "./ParticipantProfileSlide.module.css";

interface Props {
  slide: ParticipantProfileSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ParticipantProfileSlide({ slide, formatters }: Props) {
  const { participant, totalParticipants } = slide;

  const metrics = [
    {
      label: "WORDS SENT",
      value: participant.wordCount
    },
    {
      label: "CHARACTERS",
      value: participant.characterCount
    },
    ...(participant.messageCount > 0
      ? [
          {
            label: "AVG. MESSAGE LENGTH",
            value: formatters.formatNumber(Math.round(participant.averageMessageLength))
          }
        ]
      : []),
    ...(participant.nightMessages > 0
      ? [
          {
            label: "NIGHT MESSAGES",
            value: formatters.formatNumber(participant.nightMessages)
          }
        ]
      : []),
    ...(participant.emojiCount > 0
      ? [
          {
            label: "EMOJIS USED",
            value: formatters.formatNumber(participant.emojiCount)
          }
        ]
      : []),
    ...(participant.startedConversations > 0
      ? [
          {
            label: "CONVERSATIONS STARTED",
            value: formatters.formatNumber(participant.startedConversations)
          }
        ]
      : [])
  ].filter(metric => Number(metric.value) > 0);

  const hasMessages = participant.messageCount > 0;

  return (
    <section className={styles.slide}>
      <span className={layout.kicker}>
        PARTICIPANT PROFILE · {formatters.formatNumber(totalParticipants)} PEOPLE
      </span>

      <div className={styles.identity}>
        <span className={styles.profileLabel}>MEET THE PARTICIPANT</span>

        <h2 className={styles.name}>{participant.name}</h2>
      </div>

      <div className={styles.messageMetric}>
        <strong>{formatters.formatNumber(participant.messageCount)}</strong>

        <div className={styles.messageDescription}>
          <span>MESSAGES</span>
          <span>IN THIS CONVERSATION</span>
        </div>
      </div>

      <div className={styles.shareSection}>
        <div className={styles.shareHeader}>
          <span>SHARE OF THE CHAT</span>
          <strong>{formatters.formatPercentage(participant.messageShare)}</strong>
        </div>

        <div
          className={styles.shareTrack}
          role="img"
          aria-label={`${formatters.formatPercentage(participant.messageShare)} of all messages`}
        >
          <span
            className={styles.shareFill}
            style={{
              width: `${Math.max(0, Math.min(100, participant.messageShare * 100))}%`
            }}
          />
        </div>
      </div>

      {metrics.length > 0 ? (
        <div className={styles.metrics}>
          {metrics.map(metric => (
            <div className={styles.metric} key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>
          {hasMessages ? "Every message counts." : "A quiet presence in this conversation."}
        </p>
      )}

      <span className={layout.slideFootnote}>ONE OF THE PEOPLE WHO MADE THIS CHAT</span>
    </section>
  );
}
