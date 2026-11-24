import { useCallback, useEffect, useRef, useState } from "react";
import { SlideRenderer } from "../components/SlideRenderer";
import type { PreparedPresentation } from "../core/presentation";
import styles from "./StoryPage.module.css";

interface StoryPageProps {
  presentation: PreparedPresentation;
  onClose: () => void;
}

const SLIDE_DURATION = 8_000;
const TICK_INTERVAL = 50;
const LONG_PRESS_DELAY = 350;
const SWIPE_THRESHOLD = 60;

function StoryPage({ presentation, onClose }: StoryPageProps) {
  const { slides, chatTitle } = presentation.data;
  const { formatters } = presentation;

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const elapsedRef = useRef(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const suppressClickRef = useRef(false);

  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === slides.length - 1;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) {
        return;
      }

      elapsedRef.current = 0;
      setProgress(0);
      setIsPaused(false);
      setActiveIndex(index);
      setHasStarted(index > 0);
    },
    [slides.length]
  );

  const next = useCallback(() => {
    if (isLastSlide) {
      return;
    }

    goTo(activeIndex + 1);
  }, [activeIndex, goTo, isLastSlide]);

  const previous = useCallback(() => {
    if (activeIndex > 0) {
      goTo(activeIndex - 1);
    }
  }, [activeIndex, goTo]);

  const replay = useCallback(() => {
    goTo(0);
  }, [goTo]);

  const togglePause = useCallback(() => {
    if (!isFirstSlide && !isLastSlide) {
      setIsPaused(current => !current);
    }
  }, [isFirstSlide, isLastSlide]);

  useEffect(() => {
    if (!hasStarted || isPaused || isFirstSlide || isLastSlide) {
      return;
    }

    const interval = window.setInterval(() => {
      elapsedRef.current += TICK_INTERVAL;

      if (elapsedRef.current >= SLIDE_DURATION) {
        next();
        return;
      }

      setProgress(elapsedRef.current / SLIDE_DURATION);
    }, TICK_INTERVAL);

    return () => window.clearInterval(interval);
  }, [hasStarted, isPaused, isFirstSlide, isLastSlide, next]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePause();
      }

      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, previous, togglePause, onClose]);

  function clearLongPressTimer() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    };

    longPressTriggeredRef.current = false;

    if (isFirstSlide || isLastSlide || !hasStarted) {
      return;
    }

    clearLongPressTimer();

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setIsPaused(true);
    }, LONG_PRESS_DELAY);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    clearLongPressTimer();

    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start) {
      return;
    }

    if (longPressTriggeredRef.current) {
      setIsPaused(false);
      suppressClickRef.current = true;
      longPressTriggeredRef.current = false;
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      suppressClickRef.current = true;

      if (deltaX < 0) {
        next();
      } else {
        previous();
      }
    }
  }

  function handlePointerCancel() {
    clearLongPressTimer();
    pointerStartRef.current = null;
    setIsPaused(false);
    longPressTriggeredRef.current = false;
  }

  function handleNavigationClick(direction: "previous" | "next") {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (direction === "previous") {
      previous();
    } else {
      next();
    }
  }

  function getProgressWidth(index: number): string {
    if (index < activeIndex) {
      return "100%";
    }

    if (index === activeIndex) {
      return `${Math.max(0, Math.min(1, progress)) * 100}%`;
    }

    return "0%";
  }

  const activeSlide = slides[activeIndex];

  if (!activeSlide) {
    return null;
  }

  return (
    <main
      className={styles.viewer}
      data-story-theme="neon-night"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className={styles.story}>
        <div className={styles.progress}>
          {slides.map((slide, index) => (
            <div className={styles.progressTrack} key={slide.id}>
              <div className={styles.progressFill} style={{ width: getProgressWidth(index) }} />
            </div>
          ))}
        </div>

        <header className={styles.header}>
          <span className={styles.brand}>CHAT WRAPPED</span>

          <div className={styles.headerActions}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label={isPaused ? "Resume story" : "Pause story"}
              disabled={isFirstSlide || isLastSlide}
              onClick={togglePause}
            >
              {isPaused ? "▶" : "Ⅱ"}
            </button>

            <button
              className={styles.iconButton}
              type="button"
              aria-label="Close story"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </header>

        <div className={styles.slideViewport} key={activeSlide.id}>
          <SlideRenderer
            slide={activeSlide}
            chatTitle={chatTitle}
            formatters={formatters}
            onNext={next}
            onReplay={replay}
          />
        </div>

        {isPaused && <div className={styles.pausedIndicator}>PAUSED</div>}

        <div className={styles.navigation}>
          <button
            className={styles.navigationZone}
            type="button"
            aria-label="Previous slide"
            onClick={() => handleNavigationClick("previous")}
          />
          <button
            className={styles.navigationZone}
            type="button"
            aria-label="Next slide"
            onClick={() => handleNavigationClick("next")}
          />
        </div>

        <footer className={styles.footer}>
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </footer>
      </div>
    </main>
  );
}

export default StoryPage;
