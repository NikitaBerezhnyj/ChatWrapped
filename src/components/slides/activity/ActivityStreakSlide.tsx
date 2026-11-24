import type {
  ActivityStreakSlide as ActivityStreakSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ActivityStreakSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivityStreakSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="activity"
      kicker="YOU KEPT THE CONVERSATION GOING"
      title={["Some things", "just keep", "going."]}
      hero={{
        value: formatters.formatNumber(slide.longestActiveStreak),
        label: "DAYS OF CONVERSATION IN A ROW"
      }}
      footnote="YOUR LONGEST ACTIVE STREAK"
    />
  );
}
