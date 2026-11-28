import type { PresentationData, PresentationSlide, PresentationSlideKind } from "./types";

const MESSAGE_TEXT_SLIDE_KINDS: PresentationSlideKind[] = [
  "text_words",
  "text_phrases",
  "text_repeated"
];

function removeDistinctiveWords(slide: PresentationSlide): PresentationSlide {
  switch (slide.kind) {
    case "participant_profile":
      return { ...slide, participant: { ...slide.participant, distinctiveWords: [] } };

    case "participants_balance":
      return {
        ...slide,
        participants: slide.participants.map(participant => ({
          ...participant,
          distinctiveWords: []
        }))
      };

    default:
      return slide;
  }
}

export function hideMessageTextSlides(data: PresentationData): PresentationData {
  return {
    ...data,
    slides: data.slides
      .filter(slide => !MESSAGE_TEXT_SLIDE_KINDS.includes(slide.kind))
      .map(removeDistinctiveWords)
  };
}
