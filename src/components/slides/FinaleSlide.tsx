import { RotateCcw } from "lucide-react";
import type { FinaleSlide as FinaleSlideData, PreparedPresentation } from "../../core/presentation";
import styles from "./FinaleSlide.module.css";
import { PillButton } from "./PillButton";
import { SlideFrame } from "./SlideFrame";
import { Title } from "./Title";

interface Props {
  slide: FinaleSlideData;
  formatters: PreparedPresentation["formatters"];
  onReplay: () => void;
}

export function FinaleSlide({ slide, formatters, onReplay }: Props) {
  const stats = [
    { value: formatters.formatCompactNumber(slide.totalMessages), label: "MESSAGES" },
    { value: formatters.formatCompactNumber(slide.totalWords), label: "WORDS" },
    { value: formatters.formatNumber(slide.totalParticipants), label: "PARTICIPANTS" },
    { value: formatters.formatNumber(slide.activeDays), label: "ACTIVE DAYS" }
  ];

  return (
    <SlideFrame tone="finale" kicker="CHAT WRAPPED" footnote="THE STORY IN NUMBERS.">
      <div className={styles.heading}>
        <Title display lines={["And that's", "a wrap."]} outlineLine={1} />
        <p className={styles.chatTitle}>{slide.chatTitle}</p>
      </div>

      <ul className={styles.stats}>
        {stats.map(stat => (
          <li className={styles.stat} key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>

      <PillButton onClick={onReplay}>
        REPLAY STORY <RotateCcw />
      </PillButton>
    </SlideFrame>
  );
}
