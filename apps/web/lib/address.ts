/** Structured address from the Studio's `postalAddress` object. */
export type Address = {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  note?: string | null;
} | null;

/** "41600 W Smith-Enke Rd" / "Maricopa, AZ 85138" */
export function addressLines(address: Address) {
  if (!address) return [];
  const locality = [
    address.city,
    [address.state, address.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  return [address.street, locality].filter((line): line is string =>
    Boolean(line?.trim()),
  );
}

export const addressText = (address: Address) =>
  addressLines(address).join(", ");

export function mapsUrl(address: Address) {
  const text = addressText(address);
  return text
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`
    : null;
}
