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
      kicker="LONGEST PAUSE"
      title={["The longest", "pause."]}
      hero={{
        value: formatters.formatDuration(slide.longestGapMs),
        label: "BETWEEN TWO MESSAGES",
        size: "md"
      }}
      footnote="NO MESSAGES FOR THIS LONG"
    />
  );
}
