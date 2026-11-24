/** Converters from the old Portable Text shapes to the new schema. */

type Span = { _type?: string; _key?: string; text?: string; marks?: string[] };
type MarkDef = { _type?: string; _key?: string; href?: string };
type OldBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
  description?: string;
  hotspot?: unknown;
  crop?: unknown;
};

const STYLE_MAP: Record<string, string> = {
  normal: "normal",
  h1: "h2",
  h2: "h2",
  h3: "h3",
  h4: "h3",
  h5: "h3",
  h6: "h3",
  blockquote: "blockquote",
};
const DECORATORS = new Set(["strong", "em"]);
const LINK_SCHEMES = /^(https?:|mailto:|tel:)/i;

let keyCounter = 0;
export const newKey = () =>
  `m${Date.now().toString(36)}${(keyCounter++).toString(36)}`;

export function blockText(block: OldBlock) {
  return (block.children ?? []).map((child) => child.text ?? "").join("");
}

/** Plain text of a block array, paragraphs separated by blank lines. */
export function plainText(blocks: OldBlock[] | undefined) {
  return (blocks ?? [])
    .filter((b) => b._type === "block")
    .map(blockText)
    .map((t) => t.trim())
    .filter(Boolean)
    .join("\n\n");
}

/** First sentences of the text, up to `max` characters, cut at a word. */
export function summarize(text: string, max = 300) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.5) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function convertBlock(block: OldBlock) {
  const keepDefs = new Map<string, MarkDef>();
  for (const def of block.markDefs ?? []) {
    if (
      def._type === "link" &&
      def._key &&
      def.href &&
      LINK_SCHEMES.test(def.href.trim())
    ) {
      keepDefs.set(def._key, {
        _type: "link",
        _key: def._key,
        href: def.href.trim(),
      });
    }
  }
  const children = (block.children ?? []).map((child) => ({
    _type: "span",
    _key: child._key ?? newKey(),
    text: child.text ?? "",
    marks: (child.marks ?? []).filter(
      (mark) => DECORATORS.has(mark) || keepDefs.has(mark),
    ),
  }));
  return {
    _type: "block",
    _key: block._key ?? newKey(),
    style: STYLE_MAP[block.style ?? "normal"] ?? "normal",
    ...(block.listItem === "bullet" || block.listItem === "number"
      ? { listItem: block.listItem, level: block.level ?? 1 }
      : {}),
    markDefs: [...keepDefs.values()],
    children: children.length
      ? children
      : [{ _type: "span", _key: newKey(), text: "", marks: [] }],
  };
}

/**
 * Old rich text → new `richText` (or `simpleText` when `simple`).
 * Collapses runs of empty paragraphs, drops unsupported marks, maps
 * h1–h6 to two heading levels, and keeps images and PDF attachments.
 */
export function convertRichText(
  blocks: OldBlock[] | undefined,
  { simple = false } = {},
) {
  const out: Record<string, unknown>[] = [];
  let lastWasEmpty = true;
  for (const block of blocks ?? []) {
    if (block._type === "block") {
      const empty = blockText(block).trim() === "";
      if (empty) {
        if (lastWasEmpty) continue;
        lastWasEmpty = true;
        continue; // blank lines carry no meaning in the new design
      }
      lastWasEmpty = false;
      const converted = convertBlock(block);
      if (simple) {
        converted.style = "normal";
      }
      out.push(converted);
    } else if (block._type === "image" && block.asset?._ref && !simple) {
      out.push({
        _type: "imageWithAlt",
        _key: block._key ?? newKey(),
        asset: { _type: "reference", _ref: block.asset._ref },
        ...(block.alt ? { alt: block.alt } : {}),
        ...(block.caption ? { caption: block.caption } : {}),
        ...(block.hotspot ? { hotspot: block.hotspot } : {}),
        ...(block.crop ? { crop: block.crop } : {}),
      });
    } else if (block._type === "attachment" && block.asset?._ref && !simple) {
      out.push({
        _type: "fileAttachment",
        _key: block._key ?? newKey(),
        asset: { _type: "reference", _ref: block.asset._ref },
        title: block.description?.trim() || "Download the file",
      });
    }
  }
  return out;
}

/** Old image field → `imageWithAlt`. */
export function convertImage(image: OldBlock | undefined) {
  if (!image?.asset?._ref) return undefined;
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: image.asset._ref },
    ...(image.alt ? { alt: image.alt } : {}),
    ...(image.caption ? { caption: image.caption } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
    ...(image.crop ? { crop: image.crop } : {}),
  };
}

const GENERIC_LABEL =
  /^(phone|phone number|tel|telephone|main|main phone|office|call|number)$/i;

const PHONE_PATTERN =
  /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?:\s*(?:ext\.?|extension|x)\s*\d{1,6})?/gi;

/**
 * Free-text phone field → one `phoneNumber` per number, using the text in
 * front of each number as its label ("Non-Emergency: 520-…" → label
 * "Non-Emergency"). Short service codes like 911 are kept when labeled.
 */
export function parsePhones(text: string | undefined) {
  if (!text) return [];
  const phones: {
    _type: string;
    _key: string;
    label?: string;
    number: string;
  }[] = [];
  let last = 0;
  for (const match of text.matchAll(PHONE_PATTERN)) {
    const index = match.index ?? 0;
    const label = text
      .slice(last, index)
      .replace(/\b(or|and)\b/gi, " ")
      .replace(/[:\-–|,;()]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Generic labels ("Phone", "Main") add nothing next to a Call button.
    const useful = label && label.length <= 50 && !GENERIC_LABEL.test(label);
    phones.push({
      _type: "phoneNumber",
      _key: newKey(),
      ...(useful ? { label } : {}),
      number: match[0].trim(),
    });
    last = index + match[0].length;
  }
  return phones;
}

/** Website hostname → a readable publisher name. */
const PUBLISHERS: [RegExp, string][] = [
  [/aarp\.org/, "AARP"],
  [/mayoclinic\.org/, "Mayo Clinic"],
  [/inmaricopa\.com/, "InMaricopa"],
  [/pinalcentral\.com/, "PinalCentral"],
  [/maricopa-az\.gov/, "City of Maricopa"],
  [/pinal(county)?az\.gov|pinal\.gov/, "Pinal County"],
  [/alz\.org/, "Alzheimer's Association"],
  [/ncoa\.org/, "National Council on Aging"],
  [/caregiver\.com/, "Today's Caregiver"],
  [/ssa\.gov/, "Social Security Administration"],
  [/medicare\.gov/, "Medicare"],
  [/va\.gov/, "U.S. Department of Veterans Affairs"],
  [/azdhs\.gov/, "Arizona Department of Health Services"],
  [/des\.az\.gov/, "Arizona DES"],
  [/nia\.nih\.gov/, "National Institute on Aging"],
];

export function publisherFor(url: string | undefined) {
  if (!url) return undefined;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return PUBLISHERS.find(([pattern]) => pattern.test(host))?.[1] ?? host;
  } catch {
    return undefined;
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Unique slug factory per document type. */
export function slugMaker(taken: Iterable<string> = []) {
  const used = new Set(taken);
  return (input: string) => {
    const base = slugify(input) || "item";
    let slug = base;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    return slug;
  };
}

const STATES: Record<string, string> = {
  arizona: "AZ",
  "new york": "NY",
  california: "CA",
  florida: "FL",
  virginia: "VA",
  maryland: "MD",
  louisiana: "LA",
  texas: "TX",
};
/** Cities seen in the data, for addresses with no comma before the city. */
const KNOWN_CITIES = [
  "San Tan Valley",
  "Queen Creek",
  "Casa Grande",
  "Sun Lakes",
  "Maricopa",
  "Phoenix",
  "Mesa",
  "Tempe",
  "Chandler",
  "Gilbert",
  "Coolidge",
  "Florence",
  "Tucson",
  "Eloy",
  "Scottsdale",
  "Glendale",
  "Stanfield",
  "Arizona City",
  "Apache Junction",
  "Peoria",
  "New York",
];

export type PostalAddress = {
  _type: "postalAddress";
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  note?: string;
};

/**
 * Free-text address → parts. Returns `parsed: false` (and the whole text as
 * the street) when it can't be split confidently, so it gets reviewed.
 */
export function parseAddress(
  text: string | undefined,
): { address: PostalAddress; parsed: boolean } | null {
  if (!text?.trim()) return null;
  let rest = text
    .replace(/\s*\|\s*/g, ", ")
    .replace(/,?\s*(United States|USA)\b\.?/gi, "")
    .replace(/\s*\(([^)]*)\)\s*$/, "")
    .replace(/\b(AZ)(\d{5})/i, "$1 $2")
    .replace(/,\s*(AZ|Arizona),\s*(\d{5})/i, ", $1 $2")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "")
    .trim();
  let note: string | undefined;
  // "Main Office: 1110 W. Washington…" or "K9s For Warriors, 114 Camp…" →
  // the leading name becomes the note.
  const label = rest.match(/^([^0-9:]{3,80}?)(?::|,|\s-)?\s+(?=\d{2,}\s)/);
  if (
    label &&
    !/^(N|S|E|W|North|South|East|West)\.?$/i.test(label[1]?.trim() ?? "")
  ) {
    note = label[1]?.replace(/[,:-]\s*$/, "").trim();
    rest = rest.slice(label[0].length);
  }
  // "Casa Grande 85130" with no state: assume Arizona for known cities.
  const noState = rest.match(
    /[,\s]+([A-Za-z][A-Za-z .'-]*?),?\s+(\d{5}(?:-\d{4})?)$/,
  );
  if (
    noState &&
    KNOWN_CITIES.some((c) =>
      noState[1]?.toLowerCase().endsWith(c.toLowerCase()),
    )
  ) {
    rest = `${rest.slice(0, noState.index)}, ${noState[1]}, AZ ${noState[2]}`;
  } else if (
    KNOWN_CITIES.some((c) => rest.toLowerCase().endsWith(` ${c.toLowerCase()}`))
  ) {
    rest = `${rest}, AZ`;
  }
  const tail = rest.match(
    /[,\s]+([A-Za-z][A-Za-z .'-]*?)[,\s]+(AZ|Arizona|DC|[A-Z]{2}|Florida|Virginia|Maryland|California|Louisiana|Texas|New York)\.?,?(?:\s+(\d{5}(?:-\d{4})?))?\s*$/i,
  );
  if (tail) {
    let before = rest.slice(0, tail.index).trim();
    let city = tail[1]?.trim() ?? "";
    // Washington, DC quadrants belong to the street: "810 Vermont Ave., NW".
    const quadrant = city.match(/^(NW|NE|SW|SE)\s+(.+)$/);
    if (quadrant) {
      before = `${before} ${quadrant[1]}`;
      city = quadrant[2] ?? city;
    }
    // No comma before the city: take a known city off the end of the street.
    const known = KNOWN_CITIES.find((c) =>
      `${before} ${city}`.toLowerCase().endsWith(c.toLowerCase()),
    );
    if (known && !city.toLowerCase().includes(known.toLowerCase())) {
      const joined = `${before} ${city}`;
      before = joined.slice(0, joined.length - known.length).trim();
      city = known;
    } else if (
      known &&
      city.toLowerCase() !== known.toLowerCase() &&
      city.toLowerCase().endsWith(known.toLowerCase())
    ) {
      before = `${before} ${city.slice(0, city.length - known.length)}`.trim();
      city = known;
    }
    const stateRaw = tail[2] ?? "";
    const state =
      stateRaw.length === 2
        ? stateRaw.toUpperCase()
        : (STATES[stateRaw.toLowerCase()] ?? stateRaw);
    return {
      parsed: true,
      address: {
        _type: "postalAddress",
        street: before.replace(/[,\s]+$/, ""),
        city: city.replace(/\b\w/g, (c) => c.toUpperCase()),
        state,
        ...(tail[3] ? { zip: tail[3] } : {}),
        ...(note ? { note } : {}),
      },
    };
  }
  // Couldn't split it: keep exactly what was typed so nothing is lost.
  return {
    parsed: false,
    address: {
      _type: "postalAddress",
      street: text.replace(/\s+/g, " ").trim(),
    },
  };
}
