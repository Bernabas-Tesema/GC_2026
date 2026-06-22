import { MAX_LAST_WORDS } from "./constants";

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function limitToMaxWords(
  text: string,
  max: number = MAX_LAST_WORDS
): string {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const words = trimmed.split(/\s+/);
  if (words.length <= max) return text;

  return words.slice(0, max).join(" ");
}
