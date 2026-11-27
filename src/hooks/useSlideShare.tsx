import { useCallback, useEffect, useState } from "react";
import type { NoticeProps } from "../components/Notice";
import { SlideSnapshot } from "../components/SlideSnapshot";
import type { PreparedPresentation, PresentationSlide } from "../core/presentation";
import { preloadImageRenderer, renderToPng } from "../lib/render-to-png";
import { canShareFiles, downloadFile, shareFile } from "../lib/share";
import type { ThemeId } from "../themes/themes";

const SNAPSHOT_PIXEL_RATIO = 2;
const NOTICE_DURATION = 4_000;
const NOTICE_WITH_ACTION_DURATION = 8_000;

export function useSlideShare(formatters: PreparedPresentation["formatters"], theme: ThemeId) {
  const [isSharing, setIsSharing] = useState(false);
  const [notice, setNotice] = useState<NoticeProps | null>(null);
  const [canShare] = useState(canShareFiles);

  useEffect(() => {
    preloadImageRenderer();
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const duration = notice.action ? NOTICE_WITH_ACTION_DURATION : NOTICE_DURATION;
    const timer = window.setTimeout(() => setNotice(null), duration);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const shareAgain = useCallback((file: File) => {
    setNotice(null);

    shareFile(file)
      .then(result => {
        if (result === "needs-tap") {
          downloadFile(file);
        }
      })
      .catch(() => downloadFile(file));
  }, []);

  const share = useCallback(
    async (slide: PresentationSlide) => {
      setIsSharing(true);
      setNotice(null);

      try {
        const blob = await renderToPng(
          <SlideSnapshot slide={slide} formatters={formatters} theme={theme} />,
          SNAPSHOT_PIXEL_RATIO
        );

        const file = new File([blob], `chat-wrapped-${slide.kind}.png`, { type: blob.type });

        if (!canShare) {
          downloadFile(file);
          return;
        }

        if ((await shareFile(file)) === "needs-tap") {
          setNotice({
            message: "Image is ready",
            action: { label: "Share", onClick: () => shareAgain(file) }
          });
        }
      } catch (error) {
        console.error(error);
        setNotice({ message: "Couldn't prepare the image" });
      } finally {
        setIsSharing(false);
      }
    },
    [canShare, formatters, shareAgain]
  );

  return { canShare, isSharing, notice, share };
}
