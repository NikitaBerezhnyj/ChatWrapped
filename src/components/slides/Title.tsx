import styles from "./Title.module.css";

interface Props {
  lines: string[];
  display?: boolean;
  outlineLine?: number;
  singleLine?: boolean;
}

export function Title({ lines, display, outlineLine, singleLine }: Props) {
  return (
    <h2
      className={styles.title}
      data-display={display || undefined}
      data-single-line={singleLine || undefined}
    >
      {lines.map((line, index) => (
        <span key={line} data-outline={index === outlineLine || undefined}>
          {line}
        </span>
      ))}
    </h2>
  );
}
