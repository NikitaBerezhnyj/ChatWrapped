import type {
  ConversationsResponsesSlide as ConversationsResponsesSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { ShareBar } from "../ShareBar";
import { StatSlide } from "../StatSlide";
import styles from "./ConversationsResponsesSlide.module.css";

interface Props {
  slide: ConversationsResponsesSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsResponsesSlide({ slide, formatters }: Props) {
  const { responseTimeShares } = slide;

  const ranges = [
    { label: "UNDER 1 MIN", share: responseTimeShares.underOneMinute },
    { label: "1–5 MIN", share: responseTimeShares.oneToFiveMinutes },
    { label: "5–60 MIN", share: responseTimeShares.fiveToSixtyMinutes },
    { label: "1 HOUR OR MORE", share: responseTimeShares.overOneHour }
  ];

  return (
    <StatSlide
      tone="conversations"
      kicker="RESPONSE TIME"
      title={["How fast", "replies came."]}
      hero={{
        value: formatters.formatDuration(slide.medianResponseTimeMs),
        label: "MEDIAN RESPONSE TIME",
        size: "md"
      }}
      footnote="HALF OF THE REPLIES CAME FASTER"
    >
      <ul className={styles.list}>
        {ranges.map(range => (
          <li className={styles.item} key={range.label}>
            <div className={styles.row}>
              <span className={styles.label}>{range.label}</span>
              <span className={styles.share}>{formatters.formatPercentage(range.share)}</span>
            </div>

            <ShareBar value={range.share} />
          </li>
        ))}
      </ul>
    </StatSlide>
  );
}
