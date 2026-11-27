import styles from "./Notice.module.css";

export interface NoticeProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export function Notice({ message, action }: NoticeProps) {
  return (
    <div className={styles.notice} role="status">
      <span>{message}</span>

      {action && (
        <button className={styles.action} type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
