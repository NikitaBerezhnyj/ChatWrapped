import { Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PreparedPresentation, PresentationSlide } from "../core/presentation";
import styles from "./ExportSlideButton.module.css";
import { SlideRenderer } from "./SlideRenderer";

interface Props {
  slide: PresentationSlide;
  formatters: PreparedPresentation["formatters"];
  className?: string;
}

const PIXEL_RATIO = 2;

function noop() {}

function nextFrame(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function downloadImage(dataUrl: string, fileName: string) {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export function ExportSlideButton({ slide, formatters, className }: Props) {
  const [target, setTarget] = useState<PresentationSlide | null>(null);
  const snapshotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!target) {
      return;
    }

    let isCancelled = false;
    const fileName = `chat-wrapped-${target.kind}.png`;

    const save = async () => {
      try {
        const [{ toPng }] = await Promise.all([import("html-to-image"), document.fonts.ready]);

        await nextFrame();

        const node = snapshotRef.current;

        if (!node || isCancelled) {
          return;
        }

        const dataUrl = await toPng(node, { pixelRatio: PIXEL_RATIO });

        if (!isCancelled) {
          downloadImage(dataUrl, fileName);
        }
      } catch (error) {
        console.error(error);

        if (!isCancelled) {
          window.alert("Couldn't save this slide as an image.");
        }
      } finally {
        if (!isCancelled) {
          setTarget(null);
        }
      }
    };

    void save();

    return () => {
      isCancelled = true;
    };
  }, [target]);

  return (
    <>
      <button
        className={className}
        type="button"
        aria-label="Save slide as image"
        title="Save slide as image"
        disabled={target !== null}
        onClick={() => setTarget(slide)}
      >
        <Share width={18} />
      </button>

      {target &&
        createPortal(
          <div className={styles.offscreen} aria-hidden="true">
            <div className={styles.snapshot} data-story-theme="default" ref={snapshotRef}>
              <SlideRenderer slide={target} formatters={formatters} onNext={noop} onReplay={noop} />
              <span className={styles.brand}>CHAT WRAPPED</span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
