import { EllipsisVertical, X } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./ExportGuideModal.module.css";

interface Props {
  onClose: () => void;
}

export function ExportGuideModal({ onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target !== dialogRef.current) return;

    const rect = dialogRef.current.getBoundingClientRect();

    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isOutside) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="export-guide-title"
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <header className={styles.header}>
        <h2 id="export-guide-title" className={styles.title}>
          How it works
        </h2>

        <form method="dialog">
          <button type="submit" className={styles.close} aria-label="Close">
            <X size={18} aria-hidden />
          </button>
        </form>
      </header>

      <ol className={styles.steps}>
        <li>
          Open the chat in <strong>Telegram Desktop</strong>.
        </li>
        <li>
          Open the menu <EllipsisVertical size={16} aria-label="with three dots" /> and choose{" "}
          <strong>Export chat history</strong>.
        </li>
        <li>
          Set the format to <strong>Machine-readable JSON</strong>. Media files are not needed, so
          you can leave them unchecked.
        </li>
        <li>
          Click <strong>Export</strong>, then import the <strong>result.json</strong> file here.
        </li>
      </ol>

      <p className={styles.note}>
        Export is not available in the Telegram phone apps. To use your phone, send result.json to
        it first.
      </p>
    </dialog>
  );
}
