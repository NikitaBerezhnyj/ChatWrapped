import { useState } from "react";
import { StoryErrorBoundary } from "./components/StoryErrorBoundary";
import type { ChatData } from "./core/models";
import type { Period } from "./core/period";
import {
  applyNames,
  hideMessageTextSlides,
  type PreparedPresentation,
  type PresentationNames
} from "./core/presentation";
import { useTheme } from "./hooks/useTheme";
import { buildPresentation, importChat } from "./lib/chat-worker";
import CustomizePage from "./pages/CustomizePage";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";

function App() {
  const [chat, setChat] = useState<ChatData | null>(null);
  const [presentation, setPresentation] = useState<PreparedPresentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useTheme();

  async function runTask(task: () => Promise<void>) {
    setIsLoading(true);
    setError(null);

    try {
      await task();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to process this file.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleImport(file: File) {
    runTask(async () => setChat(await importChat(file)));
  }

  function handleStartStory(names: PresentationNames, hideTextSlides: boolean, period: Period) {
    if (!chat) {
      return;
    }

    runTask(async () => {
      const prepared = await buildPresentation(chat, period);
      const namedData = applyNames(prepared.data, names);

      setPresentation({
        ...prepared,
        data: hideTextSlides ? hideMessageTextSlides(namedData) : namedData
      });
    });
  }

  function handleBack() {
    setChat(null);
    setError(null);
  }

  function handleCloseStory() {
    setPresentation(null);
    setChat(null);
  }

  if (presentation) {
    return (
      <StoryErrorBoundary onBack={handleCloseStory}>
        <StoryPage presentation={presentation} theme={theme} onClose={handleCloseStory} />
      </StoryErrorBoundary>
    );
  }

  if (chat) {
    return (
      <CustomizePage
        chat={chat}
        isLoading={isLoading}
        error={error}
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
