import type {
  PreparedPresentation,
  TextRepeatedSlide as TextRepeatedSlideData
} from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./TextRepeatedSlide.module.css";

interface Props {
  slide: TextRepeatedSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextRepeatedSlide({ slide, formatters }: Props) {
  return (
    <SlideFrame tone="text" kicker="REPEATED MESSAGE" footnote="CASE AND PUNCTUATION IGNORED">
      <Title lines={["The most", "repeated", "message."]} />

      <blockquote className={styles.message}>{slide.text}</blockquote>

      <div className={styles.count}>
        <strong>{formatters.formatNumber(slide.repetitionCount)}</strong>
        <span>TIMES SENT</span>
      </div>
    </SlideFrame>
  );
}
