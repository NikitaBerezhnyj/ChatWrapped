import { ArrowUpRight } from "lucide-react";
import type { CoverSlide as CoverSlideData, PreparedPresentation } from "../../core/presentation";
import styles from "./CoverSlide.module.css";
import { PillButton } from "./PillButton";
import { SlideFrame } from "./SlideFrame";
import { Title } from "./Title";

interface Props {
  slide: CoverSlideData;
  formatters: PreparedPresentation["formatters"];
  onNext: () => void;
}

export function CoverSlide({ slide, formatters, onNext }: Props) {
  const participantsCount = slide.participants.length;

  return (
    <SlideFrame tone="cover" kicker="YOUR CONVERSATION, RECAP">
      <div className={styles.graphic} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Title display lines={["Every", "message.", "Every moment."]} outlineLine={1} />

      <div className={styles.details}>
        <h1>{slide.chatTitle}</h1>
        <p>{formatters.formatDateRange(slide.period.start, slide.period.end)}</p>
        <p>
          {formatters.formatNumber(participantsCount)}{" "}
          {participantsCount === 1 ? "participant" : "participants"}
        </p>
      </div>

      <PillButton onClick={onNext}>
        LET'S GO <ArrowUpRight />
      </PillButton>
    </SlideFrame>
  );
}
