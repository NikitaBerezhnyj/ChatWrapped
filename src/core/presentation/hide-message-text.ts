import type { PresentationData, PresentationSlideKind } from "./types";

const MESSAGE_TEXT_SLIDE_KINDS: PresentationSlideKind[] = ["text_words", "text_phrases"];

export function hideMessageTextSlides(data: PresentationData): PresentationData {
  return {
    ...data,
    slides: data.slides.filter(slide => !MESSAGE_TEXT_SLIDE_KINDS.includes(slide.kind))
  };
}
