const MENTION = /(?<![\p{L}\p{N}_])@[\p{L}\p{N}_]+/gu;

export function removeMentions(text: string): string {
  return text.replace(MENTION, " ");
}
