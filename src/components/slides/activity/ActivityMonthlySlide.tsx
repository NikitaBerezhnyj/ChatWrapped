import type {
  ActivityMonthlySlide as ActivityMonthlySlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { Bars, type BarItem } from "../Bars";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: ActivityMonthlySlideData;
  formatters: PreparedPresentation["formatters"];
}

const MAX_MONTHS_WITH_NAMES = 12;

export function ActivityMonthlySlide({ slide, formatters }: Props) {
  const months = slide.byMonth;
  const peak = months.reduce((best, item) => (item.count > best.count ? item : best));
  const showMonthNames = months.length <= MAX_MONTHS_WITH_NAMES;

  const bars: BarItem[] = months.map((item, index) => {
    const year = item.month.slice(0, 4);
    const isJanuary = item.month.endsWith("-01");

    if (showMonthNames) {
      return {
        key: item.month,
        value: item.count,
        label: formatters.formatMonth(item.month, "short"),
        sublabel: index === 0 || isJanuary ? year : undefined
      };
    }

    return {
      key: item.month,
      value: item.count,
      label: isJanuary ? year : undefined
    };
  });

  return (
    <StatSlide
      tone="activity"
      kicker="MESSAGES BY MONTH"
      title={["Month", "by month."]}
      hero={{
        value: formatters.formatMonth(peak.month),
        label: `MOST ACTIVE MONTH · ${formatters.formatNumber(peak.count)} MESSAGES`,
        size: "md"
      }}
      footnote="MONTHS WITHOUT MESSAGES COUNT AS ZERO"
    >
      <Bars
        title="MESSAGE ACTIVITY"
        note={`${months.length} MONTHS`}
        size="md"
        highlightKey={peak.month}
        ariaLabel={`Monthly message activity. Most active month: ${formatters.formatMonth(peak.month)}, with ${formatters.formatNumber(peak.count)} messages.`}
        bars={bars}
      />
    </StatSlide>
  );
}
