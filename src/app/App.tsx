import { useState, type ChangeEvent } from "react";
import { TelegramParser } from "../core/parsers/telegram";
import { LocalPresentationService, type PreparedPresentation } from "../core/presentation";
import StoryViewer from "../components/StoryViewer";
import "./App.css";

const parser = new TelegramParser();
const presentationService = new LocalPresentationService();

function App() {
  const [result, setResult] = useState<PreparedPresentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    input.value = "";

    if (!file) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const fileContent = await file.text();
      const exportData: unknown = JSON.parse(fileContent);

      const chat = parser.parse(exportData);
      const presentation = await presentationService.prepare(chat);

      setResult(presentation);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to process this file.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClosePresentation() {
    setResult(null);
  }

  if (result) {
    return <StoryViewer presentation={result} onClose={handleClosePresentation} />;
  }

  return (
    <main className="app">
      <header className="app-header">
        <a className="brand" href="./">
          <span className="brand-symbol">cw.</span>
          <span>CHAT WRAPPED</span>
        </a>

        <span className="header-label">YOUR YEAR IN MESSAGES</span>
      </header>

      <section className="import-page">
        <div className="import-copy">
          <span className="import-eyebrow">A NEW WAY TO LOOK BACK</span>

          <h1>
            Your conversations.
            <br />
            <span>Your story.</span>
          </h1>

          <p>
            The little moments, the big numbers, the words you kept repeating. See your conversation
            from a different perspective.
          </p>

          <label className={`import-button ${isLoading ? "is-loading" : ""}`}>
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
            <p className="import-status" role="status">
              Processing your conversation locally...
            </p>
          )}

          {error && (
            <div className="import-error" role="alert">
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          )}

          <div className="import-footnote">
            <span className="privacy-dot" />
            YOUR DATA STAYS IN YOUR BROWSER
          </div>
        </div>

        <div className="preview-art" aria-hidden="true">
          <div className="preview-card preview-card-back">
            <span>YOUR WORDS</span>
            <strong>hello!</strong>
            <strong>always</strong>
            <strong>haha</strong>
          </div>

          <div className="preview-card preview-card-front">
            <span>YOUR CONVERSATION</span>
            <strong>∞</strong>
            <small>MESSAGES & MEMORIES</small>
          </div>

          <span className="preview-star preview-star-one">✳</span>
          <span className="preview-star preview-star-two">✳</span>
        </div>
      </section>

      <footer className="app-footer">
        <span>CHAT WRAPPED</span>
        <span>MADE OF MESSAGES.</span>
      </footer>
    </main>
  );
}

export default App;
