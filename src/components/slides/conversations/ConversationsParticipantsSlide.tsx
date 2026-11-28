import type {
  ConversationsParticipantsSlide as ConversationsParticipantsSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./ConversationsParticipantsSlide.module.css";

interface Props {
  slide: ConversationsParticipantsSlideData;
  formatters: PreparedPresentation["formatters"];
}

const MAX_LISTED = 4;

export function ConversationsParticipantsSlide({ slide, formatters }: Props) {
  const listed = slide.participants.slice(0, MAX_LISTED);
  const hiddenCount = slide.participants.length - listed.length;

  return (
    <SlideFrame tone="conversations" kicker="WHO DID WHAT" footnote="REPLY = MEDIAN RESPONSE TIME">
      <Title lines={["Starts, ends", "and replies."]} />

      <ul className={styles.list}>
        {listed.map(participant => (
          <li className={styles.item} key={participant.id}>
            <span className={styles.name}>{participant.name}</span>

            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>STARTED</dt>
                <dd>{formatters.formatCompactNumber(participant.startedConversations)}</dd>
              </div>

              <div className={styles.stat}>
                <dt>ENDED</dt>
                <dd>{formatters.formatCompactNumber(participant.endedConversations)}</dd>
              </div>

              {participant.responseCount > 0 && (
                <div className={styles.stat}>
                  <dt>REPLY</dt>
                  <dd>{formatters.formatDuration(participant.medianResponseTimeMs)}</dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <p className={styles.more}>+ {formatters.formatNumber(hiddenCount)} MORE</p>
      )}
    </SlideFrame>
  );
}
