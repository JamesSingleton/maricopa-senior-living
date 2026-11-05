/** Month keys are "YYYY-MM" strings in Arizona time (no daylight saving). */
export function currentMonthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Phoenix",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

export function nextMonthKey(key: string) {
  const [year = 0, month = 1] = key.split("-").map(Number);
  return month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function monthLabel(key?: string) {
  if (!key || !/^\d{4}-\d{2}$/.test(key)) return "";
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, 15)).toLocaleString(
    "en-US",
    { month: "long", year: "numeric", timeZone: "UTC" },
  );
}

/** Choices for a month picker: 24 months back to 3 ahead of today. */
export function monthOptions(back = 24, ahead = 3) {
  const now = currentMonthKey();
  const [year = 0, month = 1] = now.split("-").map(Number);
  const options: { title: string; value: string }[] = [];
  for (let offset = ahead; offset >= -back; offset--) {
    const date = new Date(Date.UTC(year, month - 1 + offset, 15));
    const value = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    options.push({ title: monthLabel(value), value });
  }
  return options;
}
