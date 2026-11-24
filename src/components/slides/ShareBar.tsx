import styles from "./ShareBar.module.css";

export function ShareBar({ value }: { value: number }) {
  const percent = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div className={styles.track} aria-hidden="true">
      <span className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
}
