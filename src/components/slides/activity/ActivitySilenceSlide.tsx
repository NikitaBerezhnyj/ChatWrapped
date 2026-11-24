import type {
  ActivitySilenceSlide as ActivitySilenceSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ActivitySilenceSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivitySilenceSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="activity"
      kicker="EVEN CONVERSATIONS NEED A BREAK"
      title={["And then", "there was", "silence."]}
      hero={{
        value: formatters.formatDuration(slide.longestGapMs),
        label: "THE LONGEST PAUSE BETWEEN TWO MESSAGES",
        size: "md"
      }}
      footnote="THE LONGEST GAP IN YOUR CHAT"
    />
  );
}
