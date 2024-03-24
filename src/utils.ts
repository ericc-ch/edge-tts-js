/**
 * Returns a UUID without dashes.
 */
export function connectId(): string {
  return crypto.randomUUID().replace(/-/g, ""); // Use a regular expression to remove all dashes
}

export function removeIncompatibleCharacters(text: string): string {
  // Define regex pattern to match incompatible characters
  // deno-lint-ignore no-control-regex
  const pattern = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

  // Replace incompatible characters with a space
  return text.replace(pattern, " ");
}
