import { useState } from "react";
import { TelegramParser } from "./core/parsers/telegram";
import { LocalPresentationService, type PreparedPresentation } from "./core/presentation";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";

const parser = new TelegramParser();
const presentationService = new LocalPresentationService();

function App() {
  const [presentation, setPresentation] = useState<PreparedPresentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport(file: File) {
    setIsLoading(true);
    setError(null);

    try {
      const fileContent = await file.text();
      const exportData: unknown = JSON.parse(fileContent);

      const chat = parser.parse(exportData);
      const preparedPresentation = await presentationService.prepare(chat);

      setPresentation(preparedPresentation);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to process this file.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseStory() {
    setPresentation(null);
  }

  if (presentation) {
    return <StoryPage presentation={presentation} onClose={handleCloseStory} />;
  }

  return <HomePage isLoading={isLoading} error={error} onImport={handleImport} />;
}

export default App;
