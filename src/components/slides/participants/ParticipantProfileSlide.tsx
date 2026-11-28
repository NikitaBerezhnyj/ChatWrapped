import type {
  ParticipantProfileSlide as ParticipantProfileSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { ShareBar } from "../ShareBar";
import { StatSlide } from "../StatSlide";
import styles from "./ParticipantProfileSlide.module.css";

interface Props {
  slide: ParticipantProfileSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ParticipantProfileSlide({ slide, formatters }: Props) {
  const { participant, totalParticipants } = slide;

  const stats = [
    { label: "WORDS SENT", count: participant.wordCount },
    { label: "AVG. MESSAGE LENGTH", count: Math.round(participant.averageMessageLength) },
    { label: "MOST IN A ROW", count: participant.maxConsecutiveMessages },
    { label: "EMOJIS USED", count: participant.emojiCount }
  ]
    .filter(stat => stat.count > 0)
    .map(stat => ({
      label: stat.label,
      value: formatters.formatCompactNumber(stat.count)
    }));

  const peopleLabel = totalParticipants === 1 ? "PERSON" : "PEOPLE";

  return (
    <StatSlide
      tone="participants"
      kicker={`PARTICIPANT PROFILE · ${formatters.formatNumber(totalParticipants)} ${peopleLabel}`}
      title={[participant.name]}
      hero={{
        value: formatters.formatNumber(participant.messageCount),
        label: "MESSAGES SENT",
        size: "md"
      }}
      stats={stats}
      singleLineTitle
    >
      {participant.distinctiveWords.length > 0 && (
        <div className={styles.words}>
          <span className={styles.wordsLabel}>DISTINCTIVE WORDS</span>
          <p className={styles.wordsList}>
            {participant.distinctiveWords.map(item => item.word).join(", ")}
          </p>
        </div>
      )}

      {participant.messageCount > 0 && (
        <div className={styles.share}>
          <div className={styles.shareHeader}>
            <span>SHARE OF THE CHAT</span>
            <strong>{formatters.formatPercentage(participant.messageShare)}</strong>
          </div>

          <ShareBar value={participant.messageShare} />
        </div>
      )}
    </StatSlide>
  );
}
