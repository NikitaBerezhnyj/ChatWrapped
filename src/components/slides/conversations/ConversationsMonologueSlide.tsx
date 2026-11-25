import type {
  ConversationsMonologueSlide as ConversationsMonologueSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ConversationsMonologueSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsMonologueSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="conversations"
      kicker="MESSAGES IN A ROW"
      title={["The most", "messages in", "a row."]}
      hero={{
        value: formatters.formatNumber(slide.maxConsecutiveMessages),
        label: "SENT BY ONE PERSON"
      }}
      footnote="NO ONE ELSE WROTE IN BETWEEN"
    />
  );
}
