import styles from "./Bars.module.css";

export interface BarItem {
  key: string;
  value: number;
  label?: string;
  sublabel?: string;
}

interface Props {
  bars: BarItem[];
  ariaLabel: string;
  highlightKey?: string;
  size?: "sm" | "md";
  title?: string;
  note?: string;
}

export function Bars({ bars, ariaLabel, highlightKey, size = "sm", title, note }: Props) {
  const max = Math.max(...bars.map(bar => bar.value), 1);

  return (
    <div className={styles.chart}>
      {(title || note) && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <span className={styles.note}>{note}</span>
        </div>
      )}

      <div
        className={styles.bars}
        data-size={size}
        data-dense={bars.length > 30 || undefined}
        role="img"
        aria-label={ariaLabel}
      >
        {bars.map(bar => (
          <div className={styles.column} key={bar.key}>
            <div className={styles.track}>
              <span
                className={styles.fill}
                data-highlight={bar.key === highlightKey || undefined}
                style={{ height: `${(bar.value / max) * 100}%` }}
              />
            </div>

            {bar.label && <span className={styles.label}>{bar.label}</span>}
            {bar.sublabel && <span className={styles.sublabel}>{bar.sublabel}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
