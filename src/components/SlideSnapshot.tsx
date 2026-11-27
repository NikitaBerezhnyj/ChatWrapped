import type { PreparedPresentation, PresentationSlide } from "../core/presentation";
import type { ThemeId } from "../themes/themes";
import { SlideRenderer } from "./SlideRenderer";
import styles from "./SlideSnapshot.module.css";

interface SlideSnapshotProps {
  slide: PresentationSlide;
  formatters: PreparedPresentation["formatters"];
  theme: ThemeId;
}

function noop() {}

export function SlideSnapshot({ slide, formatters, theme }: SlideSnapshotProps) {
  return (
    <div className={styles.snapshot} data-story-theme={theme}>
      <SlideRenderer slide={slide} formatters={formatters} onNext={noop} onReplay={noop} />
      <span className={styles.brand}>CHAT WRAPPED</span>
    </div>
  );
}
