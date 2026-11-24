import type { ReactNode } from "react";
import { SlideFrame, type SlideTone } from "./SlideFrame";
import styles from "./StatSlide.module.css";
import { Title } from "./Title";

interface Props {
  tone: SlideTone;
  kicker: string;
  title: string[];
  hero: {
    value: ReactNode;
    label: string;
    size?: "lg" | "md";
  };
  stats?: Array<{ value: ReactNode; label: string }>;
  footnote?: ReactNode;
  children?: ReactNode;
}

export function StatSlide({ tone, kicker, title, hero, stats = [], footnote, children }: Props) {
  return (
    <SlideFrame tone={tone} kicker={kicker} footnote={footnote}>
      <Title lines={title} />

      <div className={styles.hero} data-size={hero.size ?? "lg"}>
        <strong className={styles.value}>{hero.value}</strong>
        <span className={styles.label}>{hero.label}</span>
      </div>

      {stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map(stat => (
            <div className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </SlideFrame>
  );
}
