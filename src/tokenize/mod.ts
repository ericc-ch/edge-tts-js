import { ABBREVIATIONS } from "./_abbreviations.ts";
import { CONTRACTIONS } from "./_contractions.ts";
import { EMOJIS } from "./_emojis.ts";

const PREFIXES = /^([,([{*<"“'`‘]|\.{1,3})/gi;
const SUFFIXES = /([,.!?%*>:;"'”`)\]}]|\.\.\.)$/gi;

interface TokenizeOptions {
  emojis?: Set<string>;
  abbreviations?: Set<string>;
  contractions?: Set<string>;
  prefixRegex?: RegExp;
  suffixRegex?: RegExp;
}

export function tokenizeSubstring(
  substr: string,
  options: TokenizeOptions
): string[] {
  const {
    emojis = EMOJIS,
    abbreviations = ABBREVIATIONS,
    contractions = CONTRACTIONS,
    prefixRegex = PREFIXES,
    suffixRegex = SUFFIXES,
  } = options;

  // Handle special cases: emojis, abbreviations, and contractions
  if (
    emojis.has(substr) ||
    abbreviations.has(substr) ||
    contractions.has(substr)
  ) {
    return [substr];
  }

  const tokens: string[] = [];
  let word = substr;

  // Extract prefixes
  let match = word.match(prefixRegex);
  while (match) {
    const [prefix, remaining] = match;
    tokens.push(prefix);
    word = remaining;
    match = word.match(prefixRegex);
  }

  // Extract suffixes
  const suffixes: string[] = [];
  match = word.match(suffixRegex);
  while (match) {
    const [suffix, remaining] = match;
    suffixes.unshift(suffix);
    word = remaining;
    match = remaining.match(suffixRegex);
  }

  // Handle ellipsis
  if (suffixes.length > 0 && suffixes[0] === "...") {
    suffixes.shift();
    suffixes.push("...");
  }

  tokens.push(word);
  tokens.push(...suffixes);

  return tokens;
}
