import type {
  CoverSlide,
  ParticipantsBalanceSlide,
  PresentationData,
  PresentationParticipant,
  PresentationSlide
} from "./types";

export interface PresentationNames {
  chatTitle: string;
  participants: Record<string, string>;
}

export const MAX_NAME_LENGTH = 40;

const ANONYMOUS_CHAT_TITLE = "Chat";

function isCoverSlide(slide: PresentationSlide): slide is CoverSlide {
  return slide.kind === "cover";
}

function isBalanceSlide(slide: PresentationSlide): slide is ParticipantsBalanceSlide {
  return slide.kind === "participants_balance";
}

function resolveName(original: string, custom: string | undefined): string {
  const name = Array.from(custom?.trim() ?? "")
    .slice(0, MAX_NAME_LENGTH)
    .join("")
    .trim();

  return name || original;
}

function getChatTitle(participants: PresentationParticipant[], originalTitle: string): string {
  if (participants.length !== 2) {
    return originalTitle;
  }

  return `${participants[0].name} & ${participants[1].name}`;
}

export function getParticipantList(data: PresentationData): PresentationParticipant[] {
  const participants: Array<{ id: string; name: string }> =
    data.slides.find(isBalanceSlide)?.participants ??
    data.slides.find(isCoverSlide)?.participants ??
    [];

  return participants.map(({ id, name }) => ({ id, name }));
}

export function getDefaultNames(data: PresentationData): PresentationNames {
  const participants = getParticipantList(data);

  return {
    chatTitle: getChatTitle(participants, data.chatTitle),
    participants: Object.fromEntries(
      participants.map(participant => [participant.id, participant.name])
    )
  };
}

export function getAnonymousNames(data: PresentationData): PresentationNames {
  const participants = getParticipantList(data);
  const anonymousParticipants = participants.map((participant, index) => ({
    ...participant,
    name: `Person ${index + 1}`
  }));

  return {
    chatTitle: getChatTitle(anonymousParticipants, ANONYMOUS_CHAT_TITLE),
    participants: Object.fromEntries(
      anonymousParticipants.map(participant => [participant.id, participant.name])
    )
  };
}

export function applyNames(data: PresentationData, names: PresentationNames): PresentationData {
  const chatTitle = resolveName(data.chatTitle, names.chatTitle);

  function rename<T extends { id: string; name: string }>(participant: T): T {
    return {
      ...participant,
      name: resolveName(participant.name, names.participants[participant.id])
    };
  }

  function renameSlide(slide: PresentationSlide): PresentationSlide {
    switch (slide.kind) {
      case "cover":
        return { ...slide, chatTitle, participants: slide.participants.map(rename) };

      case "finale":
        return { ...slide, chatTitle };

      case "participants_balance":
        return { ...slide, participants: slide.participants.map(rename) };

      case "participant_profile":
        return { ...slide, participant: rename(slide.participant) };

      case "achievement":
        return { ...slide, holders: slide.holders.map(rename) };

      default:
        return slide;
    }
  }

  return {
    chatTitle,
    slides: data.slides.map(renameSlide)
  };
}
