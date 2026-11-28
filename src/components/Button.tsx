import type { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: ReactNode;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Button({
  children,
  variant = "solid",
  type = "button",
  disabled,
  className,
  onClick
}: ButtonProps) {
  const classNames = [styles.button, variant === "outline" && styles.outline, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
