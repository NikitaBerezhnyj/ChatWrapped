import type {
  OverviewDurationSlide as OverviewDurationSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: OverviewDurationSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function OverviewDurationSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="duration"
      kicker="DURATION"
      title={["How long", "the chat", "has lasted."]}
      hero={{
        value: formatters.formatDuration(slide.durationMs),
        label: "FROM FIRST MESSAGE TO LAST",
        size: "md"
      }}
      stats={[{ value: formatters.formatNumber(slide.activeDays), label: "ACTIVE DAYS" }]}
      footnote={formatters.formatDateRange(slide.period.start, slide.period.end)}
    />
  );
}
