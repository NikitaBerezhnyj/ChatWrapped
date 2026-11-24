import type {
  ConversationsResponsesSlide as ConversationsResponsesSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ConversationsResponsesSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsResponsesSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="conversations"
      kicker="RESPONSE TIME"
      title={["The conversation", "kept moving."]}
      hero={{
        value: formatters.formatDuration(slide.averageResponseTimeMs),
        label: "AVERAGE RESPONSE TIME",
        size: "md"
      }}
      stats={[
        {
          value: formatters.formatDuration(slide.fastestResponseTimeMs),
          label: "FASTEST RESPONSE"
        },
        {
          value: formatters.formatDuration(slide.longestResponseTimeMs),
          label: "LONGEST RESPONSE"
        }
      ]}
      footnote="EVERY REPLY HAS ITS OWN TIMING"
    />
  );
}
