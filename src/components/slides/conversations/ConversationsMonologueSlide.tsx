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
      kicker="THE MONOLOGUE"
      title={["Sometimes,", "one message", "led to another."]}
      hero={{
        value: formatters.formatNumber(slide.maxConsecutiveMessages),
        label: "MESSAGES IN A ROW FROM ONE PERSON"
      }}
      footnote="ONE VOICE, MESSAGE AFTER MESSAGE"
    />
  );
}
