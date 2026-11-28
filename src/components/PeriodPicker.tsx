import type { AvailablePeriods, Period } from "../core/period";
import { LocalPresentationFormatterFactory } from "../core/presentation";
import styles from "./PeriodPicker.module.css";

const formatters = new LocalPresentationFormatterFactory().create();

type PeriodType = "all" | "year" | "month";

interface PeriodPickerProps {
  periods: AvailablePeriods;
  value: Period;
  onChange: (period: Period) => void;
}

function getPeriodType(period: Period): PeriodType {
  if (period === null) {
    return "all";
  }

  return period.length === 4 ? "year" : "month";
}

function getPeriod(periods: AvailablePeriods, type: PeriodType, year = periods.years[0]): Period {
  if (type === "all") {
    return null;
  }

  if (type === "year") {
    return year;
  }

  return periods.months.find(month => month.startsWith(year)) ?? null;
}

export function PeriodPicker({ periods, value, onChange }: PeriodPickerProps) {
  const type = getPeriodType(value);
  const year = value?.slice(0, 4);

  return (
    <fieldset className={styles.picker}>
      <legend className={styles.legend}>PERIOD</legend>

      <div className={styles.controls}>
        <select
          className={styles.select}
          aria-label="Period type"
          value={type}
          onChange={event => onChange(getPeriod(periods, event.target.value as PeriodType, year))}
        >
          <option value="all">All time</option>
          <option value="year">Year</option>
          <option value="month">Month</option>
        </select>

        {year && (
          <select
            className={styles.select}
            aria-label="Year"
            value={year}
            onChange={event => onChange(getPeriod(periods, type, event.target.value))}
          >
            {periods.years.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}

        {value && type === "month" && (
          <select
            className={styles.select}
            aria-label="Month"
            value={value}
            onChange={event => onChange(event.target.value)}
          >
            {periods.months
              .filter(month => month.startsWith(value.slice(0, 4)))
              .map(month => (
                <option key={month} value={month}>
                  {formatters.formatMonth(month, "short")}
                </option>
              ))}
          </select>
        )}
      </div>
    </fieldset>
  );
}
