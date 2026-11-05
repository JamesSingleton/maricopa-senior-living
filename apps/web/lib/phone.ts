/**
 * Phone fields are free text, and many hold several numbers with labels, e.g.
 * "Emergency: 911  Non-Emergency: 520-568-3673". Linking the whole string
 * dials nonsense, so we find each North American number (with an optional
 * extension) and link only that.
 */
const PHONE_PATTERN =
  /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?:\s*(?:ext\.?|extension|x)\s*\d{1,6})?/gi;

export type PhoneSegment =
  | { type: "text"; value: string }
  | { type: "phone"; value: string; href: string };

/** `tel:` URI for one matched number, e.g. "tel:+15205683673;ext=12". */
export function telHref(number: string): string {
  const [main = "", extension] = number.split(/\s*(?:ext\.?|extension|x)\s*/i);
  let digits = main.replace(/\D/g, "");
  if (digits.length === 10) digits = `1${digits}`;
  const ext = extension?.replace(/\D/g, "");
  return `tel:+${digits}${ext ? `;ext=${ext}` : ""}`;
}

/** Split free-text phone info into plain text and dialable numbers. */
export function splitPhoneText(text: string): PhoneSegment[] {
  const segments: PhoneSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(PHONE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    segments.push({ type: "phone", value: match[0], href: telHref(match[0]) });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}
