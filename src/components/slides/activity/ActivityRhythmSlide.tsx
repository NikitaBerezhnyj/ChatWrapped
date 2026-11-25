import type {
  ActivityRhythmSlide as ActivityRhythmSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { Bars } from "../Bars";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";

interface Props {
  slide: ActivityRhythmSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function ActivityRhythmSlide({ slide, formatters }: Props) {
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: slide.byHour.find(item => item.hour === hour)?.count ?? 0
  }));

  const weekdays = Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    count: slide.byWeekday.find(item => item.weekday === weekday)?.count ?? 0
  }));

  const peakHour = hours.reduce((peak, item) => (item.count > peak.count ? item : peak));
  const peakWeekday = weekdays.reduce((peak, item) => (item.count > peak.count ? item : peak));

  const peakHourLabel = formatters.formatHour(peakHour.hour);
  const peakWeekdayLabel = formatters.formatWeekday(peakWeekday.weekday);

  return (
    <SlideFrame
      tone="activity"
      kicker="MESSAGES BY HOUR AND WEEKDAY"
      footnote="HOURS IN THE TIME ZONE OF THIS DEVICE"
    >
      <Title lines={["When messages", "were sent."]} />

      <Bars
        title="BY HOUR"
        note={`PEAK AT ${peakHourLabel}`}
        ariaLabel={`Messages by hour. Peak hour: ${peakHourLabel} with ${formatters.formatNumber(peakHour.count)} messages.`}
        highlightKey={String(peakHour.hour)}
        bars={hours.map(item => ({
          key: String(item.hour),
          value: item.count,
          label: item.hour % 3 === 0 ? formatters.formatHour(item.hour) : undefined
        }))}
      />

      <Bars
        title="BY WEEKDAY"
        note={`PEAK ON ${formatters.formatWeekday(peakWeekday.weekday, "short")}`}
        ariaLabel={`Messages by weekday. Peak day: ${peakWeekdayLabel} with ${formatters.formatNumber(peakWeekday.count)} messages.`}
        highlightKey={String(peakWeekday.weekday)}
        bars={weekdays.map(item => ({
          key: String(item.weekday),
          value: item.count,
          label: formatters.formatWeekday(item.weekday, "short"),
          sublabel: formatters.formatCompactNumber(item.count)
        }))}
      />
    </SlideFrame>
  );
}
