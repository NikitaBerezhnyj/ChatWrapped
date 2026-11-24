import type {
  ActivityPeakSlide as ActivityPeakSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ActivityPeakSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivityPeakSlide({ slide, formatters }: Props) {
  const { mostActiveDay, mostActiveMonth, mostActiveHour, mostActiveWeekday } = slide;

  return (
    <StatSlide
      tone="activity"
      kicker="WHEN YOU WERE MOST ALIVE"
      title={["One day stood", "above the rest."]}
      hero={{
        value: formatters.formatNumber(mostActiveDay.count),
        label: `MESSAGES ON ${formatters.formatDay(mostActiveDay.date)}`
      }}
      stats={[
        {
          value: formatters.formatMonth(mostActiveMonth.month),
          label: `TOP MONTH · ${formatters.formatNumber(mostActiveMonth.count)} MESSAGES`
        },
        {
          value: formatters.formatHour(mostActiveHour.hour),
          label: `TOP HOUR · ${formatters.formatNumber(mostActiveHour.count)} MESSAGES`
        },
        {
          value: formatters.formatWeekday(mostActiveWeekday.weekday),
          label: `TOP WEEKDAY · ${formatters.formatNumber(mostActiveWeekday.count)} MESSAGES`
        }
      ]}
      footnote="YOUR CHAT'S BUSIEST MOMENTS"
    />
  );
}
