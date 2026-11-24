import styles from "./Title.module.css";

export function Title({ lines }: { lines: string[] }) {
  return (
    <h2 className={styles.title}>
      {lines.map(line => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );
}
