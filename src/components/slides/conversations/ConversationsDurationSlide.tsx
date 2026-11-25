import type {
  ConversationsDurationSlide as ConversationsDurationSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ConversationsDurationSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsDurationSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="conversations"
      kicker="CONVERSATION LENGTH"
      title={["How long", "conversations", "lasted."]}
      hero={{
        value: formatters.formatDuration(slide.averageDurationMs),
        label: "AVERAGE CONVERSATION",
        size: "md"
      }}
      stats={[
        {
          value: formatters.formatDuration(slide.longestDurationMs),
          label: "THE LONGEST ONE LASTED"
        }
      ]}
      footnote="FROM FIRST TO LAST MESSAGE OF EACH"
    />
  );
}
