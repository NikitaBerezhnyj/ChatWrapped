import type {
  PreparedPresentation,
  TextRepeatedSlide as TextRepeatedSlideData
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: TextRepeatedSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextRepeatedSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="text"
      kicker="REPEATED MESSAGE"
      title={["The most", "repeated", "message."]}
      hero={{
        value: formatters.formatNumber(slide.repetitionCount),
        label: "TIMES THE SAME MESSAGE WAS SENT"
      }}
      footnote="CASE AND PUNCTUATION IGNORED"
    />
  );
}
