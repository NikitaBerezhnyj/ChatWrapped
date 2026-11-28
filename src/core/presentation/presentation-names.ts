import type { ChatData, Participant } from "../models";
import type { PresentationData, PresentationParticipant, PresentationSlide } from "./types";

export interface PresentationNames {
  chatTitle: string;
  participants: Record<string, string>;
}

export const MAX_NAME_LENGTH = 40;

const ANONYMOUS_CHAT_TITLE = "Chat";

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

export function getParticipantList(chat: ChatData): Participant[] {
  const counts = new Map<string | null, number>();

  for (const message of chat.messages) {
    counts.set(message.senderId, (counts.get(message.senderId) ?? 0) + 1);
  }

  return [...chat.participants].sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0));
}

export function getDefaultNames(chat: ChatData): PresentationNames {
  const participants = getParticipantList(chat);

  return {
    chatTitle: getChatTitle(participants, chat.title),
    participants: Object.fromEntries(
      participants.map(participant => [participant.id, participant.name])
    )
  };
}

export function getAnonymousNames(chat: ChatData): PresentationNames {
  const anonymousParticipants = getParticipantList(chat).map((participant, index) => ({
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

      case "conversations_participants":
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
