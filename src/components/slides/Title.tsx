import styles from "./Title.module.css";

interface Props {
  lines: string[];
  display?: boolean;
  outlineLine?: number;
}

export function Title({ lines, display, outlineLine }: Props) {
  return (
    <h2 className={styles.title} data-display={display || undefined}>
      {lines.map((line, index) => (
        <span key={line} data-outline={index === outlineLine || undefined}>
          {line}
        </span>
      ))}
    </h2>
  );
}
