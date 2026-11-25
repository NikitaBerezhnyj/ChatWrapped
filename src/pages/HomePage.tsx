import type { ChangeEvent } from "react";
import styles from "./HomePage.module.css";

interface HomePageProps {
  isLoading: boolean;
  error: string | null;
  onImport: (file: File) => void;
}

function HomePage({ isLoading, error, onImport }: HomePageProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (file) {
      onImport(file);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="./">
          <span className={styles.brandSymbol}>cw.</span>
          <span>CHAT WRAPPED</span>
        </a>

        <span className={styles.headerLabel}>YOUR CHAT IN NUMBERS</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>A NEW WAY TO LOOK BACK</span>

          <h1 className={styles.heroTitle}>
            Your conversations.
            <br />
            <span className={styles.heroTitleAccent}>Your story.</span>
          </h1>

          <p className={styles.heroDescription}>
            The little moments, the big numbers, the words you kept repeating. See your conversation
            from a different perspective.
          </p>

          <label
            className={`${styles.importButton} ${isLoading ? styles.importButtonLoading : ""}`}
          >
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              disabled={isLoading}
            />

            <span>{isLoading ? "ANALYZING..." : "IMPORT TELEGRAM EXPORT"}</span>

            {!isLoading && <span aria-hidden="true">↗</span>}
          </label>

          {isLoading && (
            <p className={styles.importStatus} role="status">
              Processing your conversation locally...
            </p>
          )}

          {error && (
            <div className={styles.importError} role="alert">
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.privacyNote}>
            <span className={styles.privacyDot} />
            YOUR DATA STAYS IN YOUR BROWSER
          </div>
        </div>

        <div className={styles.preview} aria-hidden="true">
          <div className={`${styles.previewCard} ${styles.previewCardBack}`}>
            <span>YOUR WORDS</span>
            <strong>hello!</strong>
            <strong>always</strong>
            <strong>haha</strong>
          </div>

          <div className={`${styles.previewCard} ${styles.previewCardFront}`}>
            <span>YOUR CONVERSATION</span>
            <strong>∞</strong>
            <small>MESSAGES & MEMORIES</small>
          </div>

          <span className={`${styles.previewStar} ${styles.previewStarOne}`}>✳</span>

          <span className={`${styles.previewStar} ${styles.previewStarTwo}`}>✳</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>CHAT WRAPPED</span>
        <span>MADE OF MESSAGES.</span>
      </footer>
    </main>
  );
}

export default HomePage;
