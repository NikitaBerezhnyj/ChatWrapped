import type {
  ParticipantsBalanceSlide as ParticipantsBalanceSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { ShareBar } from "../ShareBar";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./ParticipantsBalanceSlide.module.css";

interface Props {
  slide: ParticipantsBalanceSlideData;
  formatters: PreparedPresentation["formatters"];
}

const MAX_LISTED = 5;

export function ParticipantsBalanceSlide({ slide, formatters }: Props) {
  const { participants } = slide;

  const listed = participants.slice(0, MAX_LISTED);
  const hiddenCount = participants.length - listed.length;

  const totalMessages = participants.reduce(
    (total, participant) => total + participant.messageCount,
    0
  );

  const participantsLabel = participants.length === 1 ? "PARTICIPANT" : "PARTICIPANTS";

  return (
    <SlideFrame
      tone="participants"
      kicker="THE PEOPLE BEHIND THE MESSAGES"
      footnote={`${formatters.formatNumber(participants.length)} ${participantsLabel} · ${formatters.formatNumber(totalMessages)} MESSAGES`}
    >
      <Title lines={["Every person", "made this", "conversation."]} />

      <ol className={styles.list}>
        {listed.map((participant, index) => (
          <li className={styles.item} key={participant.id}>
            <div className={styles.row}>
              <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{participant.name}</span>
              <span className={styles.share}>
                {formatters.formatPercentage(participant.messageShare)}
              </span>
            </div>

            <ShareBar value={participant.messageShare} />

            <span className={styles.count}>
              {formatters.formatNumber(participant.messageCount)} messages
            </span>
          </li>
        ))}
      </ol>

      {hiddenCount > 0 && (
        <p className={styles.more}>+ {formatters.formatNumber(hiddenCount)} MORE</p>
      )}
    </SlideFrame>
  );
}
