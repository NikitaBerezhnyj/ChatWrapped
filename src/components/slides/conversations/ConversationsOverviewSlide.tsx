import type {
  ConversationsOverviewSlide as ConversationsOverviewSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ConversationsOverviewSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ConversationsOverviewSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="conversations"
      kicker="CONVERSATIONS"
      title={["Every conversation", "had a beginning."]}
      hero={{
        value: formatters.formatNumber(slide.totalConversations),
        label: slide.totalConversations === 1 ? "CONVERSATION" : "CONVERSATIONS"
      }}
      footnote="A CLOSER LOOK AT YOUR CONVERSATIONS"
    />
  );
}
