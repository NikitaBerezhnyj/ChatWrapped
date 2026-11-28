const LINK_PREFIX = /https?:\/\/|www\./i;
const DOMAIN_ENDING = /\.\p{L}{2,}$/u;

function isLink(word: string): boolean {
  if (LINK_PREFIX.test(word)) {
    return true;
  }

  const slashIndex = word.indexOf("/");

  return slashIndex > 0 && DOMAIN_ENDING.test(word.slice(0, slashIndex));
}

export function removeLinks(text: string): string {
  return text
    .split(/\s+/)
    .filter(word => !isLink(word))
    .join(" ");
}
