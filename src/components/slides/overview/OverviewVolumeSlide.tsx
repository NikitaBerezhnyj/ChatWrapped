import type {
  OverviewVolumeSlide as OverviewVolumeSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: OverviewVolumeSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewVolumeSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="overview"
      kicker="THE BIG PICTURE"
      title={["The chat", "in numbers."]}
      hero={{
        value: formatters.formatCompactNumber(slide.totalMessages),
        label: "MESSAGES EXCHANGED"
      }}
      stats={[
        { value: formatters.formatCompactNumber(slide.totalWords), label: "WORDS" },
        { value: formatters.formatCompactNumber(slide.totalCharacters), label: "CHARACTERS" },
        { value: formatters.formatNumber(slide.messagesWithText), label: "TEXT MESSAGES" },
        {
          value: formatters.formatPercentage(slide.messagesWithText / slide.totalMessages),
          label: "WITH TEXT"
        }
      ]}
      footnote="WORDS AND CHARACTERS COUNT TEXT ONLY"
    />
  );
}
