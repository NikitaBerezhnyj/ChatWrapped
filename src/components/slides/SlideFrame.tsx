import type { ReactNode } from "react";
import styles from "./SlideFrame.module.css";

export type SlideTone =
  | "cover"
  | "overview"
  | "duration"
  | "pace"
  | "activity"
  | "participants"
  | "text"
  | "conversations"
  | "achievements"
  | "finale";

interface Props {
  tone: SlideTone;
  kicker: string;
  footnote?: ReactNode;
  children: ReactNode;
}

export function SlideFrame({ tone, kicker, footnote, children }: Props) {
  return (
    <section className={styles.frame} data-tone={tone}>
      <span className={styles.kicker}>{kicker}</span>
      <div className={styles.body}>{children}</div>
      {footnote && <span className={styles.footnote}>{footnote}</span>}
    </section>
  );
}
