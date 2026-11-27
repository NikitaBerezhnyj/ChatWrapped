import { useState } from "react";
import { StoryErrorBoundary } from "./components/StoryErrorBoundary";
import {
  applyNames,
  hideMessageTextSlides,
  type PreparedPresentation,
  type PresentationNames
} from "./core/presentation";
import { useTheme } from "./hooks/useTheme";
import { importChat } from "./lib/import-chat";
import CustomizePage from "./pages/CustomizePage";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";

function App() {
  const [imported, setImported] = useState<PreparedPresentation | null>(null);
  const [presentation, setPresentation] = useState<PreparedPresentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useTheme();

  async function handleImport(file: File) {
    setIsLoading(true);
    setError(null);

    try {
      setImported(await importChat(file));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to process this file.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartStory(names: PresentationNames, hideTextSlides: boolean) {
    if (!imported) {
      return;
    }

    const namedData = applyNames(imported.data, names);

    setPresentation({
      ...imported,
      data: hideTextSlides ? hideMessageTextSlides(namedData) : namedData
    });
  }

  function handleBack() {
    setImported(null);
  }

  function handleCloseStory() {
    setPresentation(null);
    setImported(null);
  }

  if (presentation) {
    return (
      <StoryErrorBoundary onBack={handleCloseStory}>
        <StoryPage presentation={presentation} theme={theme} onClose={handleCloseStory} />
      </StoryErrorBoundary>
    );
  }

  if (imported) {
    return (
      <CustomizePage
        data={imported.data}
        theme={theme}
        onThemeChange={setTheme}
        onStart={handleStartStory}
        onBack={handleBack}
      />
    );
  }

  return <HomePage isLoading={isLoading} error={error} onImport={handleImport} />;
}

export default App;
