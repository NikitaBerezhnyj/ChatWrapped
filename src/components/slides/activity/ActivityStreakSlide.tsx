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
      kicker="LONGEST STREAK"
      title={["The longest", "streak of", "active days."]}
      hero={{
        value: formatters.formatNumber(slide.longestActiveStreak),
        label: "DAYS IN A ROW WITH MESSAGES"
      }}
      footnote="AT LEAST ONE MESSAGE EACH DAY"
    />
  );
}
