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
    phones.push({
      _type: "phoneNumber",
      _key: newKey(),
      ...(label && label.length <= 50 ? { label } : {}),
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
