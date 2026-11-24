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
      kicker="SOME THINGS BEAR REPEATING"
      title={["Once was", "never", "enough."]}
      hero={{
        value: formatters.formatNumber(slide.repetitionCount),
        label: "REPETITIONS OF THE MOST REPEATED MESSAGE"
      }}
      footnote="THE MESSAGE THAT KEPT COMING BACK"
    />
  );
}
