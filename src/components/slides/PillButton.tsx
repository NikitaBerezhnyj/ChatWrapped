import type { ReactNode } from "react";
import styles from "./PillButton.module.css";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export function PillButton({ onClick, children }: Props) {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
