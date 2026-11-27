import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

interface PageIntroProps {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  size?: "default" | "hero";
}

export function PageIntro({ eyebrow, title, description, size = "default" }: PageIntroProps) {
  return (
    <div className={styles.intro} data-size={size}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
