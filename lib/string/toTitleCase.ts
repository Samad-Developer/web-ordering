/**
 * Converts a string to Title Case.
 * Example: "hello world" -> "Hello World"
 * Handles extra spaces and hyphenated words.
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/) // split by one or more spaces
    .map(word =>
      word
        .split('-') // handle hyphenated words
        .map(
          part => part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join('-')
    )
    .join(' ');
}
