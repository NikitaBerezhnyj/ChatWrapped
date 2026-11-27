import type { ReactElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export function preloadImageRenderer(): void {
  import("html-to-image");
}

function nextFrame(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export async function renderToPng(element: ReactElement, pixelRatio: number): Promise<Blob> {
  const container = document.createElement("div");

  container.setAttribute("aria-hidden", "true");
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "-10000px",
    pointerEvents: "none"
  });
  document.body.append(container);

  const root = createRoot(container);

  try {
    flushSync(() => root.render(element));

    const [{ toBlob }] = await Promise.all([import("html-to-image"), document.fonts.ready]);

    await nextFrame();

    const node = container.firstElementChild;

    if (!(node instanceof HTMLElement)) {
      throw new Error("Nothing was rendered.");
    }

    const blob = await toBlob(node, { pixelRatio });

    if (!blob) {
      throw new Error("The image could not be created.");
    }

    return blob;
  } finally {
    root.unmount();
    container.remove();
  }
}
