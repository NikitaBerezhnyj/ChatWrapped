import type {
  OverviewPaceSlide as OverviewPaceSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: OverviewPaceSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewPaceSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="pace"
      kicker="THE CONVERSATION'S PACE"
      title={["Some chats", "never slow down."]}
      hero={{
        value: formatters.formatNumber(Math.round(slide.averageMessagesPerActiveDay)),
        label: "MESSAGES PER ACTIVE DAY"
      }}
      stats={[
        {
          value: formatters.formatNumber(Number(slide.averageWordsPerMessage.toFixed(1))),
          label: "WORDS PER MESSAGE"
        },
        {
          value: formatters.formatNumber(Math.round(slide.averageCharactersPerMessage)),
          label: "CHARACTERS PER MESSAGE"
        }
      ]}
    />
  );
}
