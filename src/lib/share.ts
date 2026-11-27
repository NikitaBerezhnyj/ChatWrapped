export function canShareFiles(): boolean {
  if (typeof navigator.canShare !== "function") {
    return false;
  }

  return navigator.canShare({ files: [new File([""], "slide.png", { type: "image/png" })] });
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.name;
  link.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export type ShareResult = "done" | "needs-tap";

export async function shareFile(file: File): Promise<ShareResult> {
  try {
    await navigator.share({ files: [file] });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "done";
    }

    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return "needs-tap";
    }

    throw error;
  }

  return "done";
}
