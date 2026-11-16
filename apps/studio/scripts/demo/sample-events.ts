/**
 * Demo only: a few sample events in the development dataset, so the Events
 * pages aren't empty when showing the rebuild. Every title starts with
 * "Sample:" and every summary says it is not a real event.
 *
 *   node --env-file=../web/.env.local scripts/demo/sample-events.ts          # add
 *   node --env-file=../web/.env.local scripts/demo/sample-events.ts --remove # remove
 */
import { createClient } from "@sanity/client";

const dev = createClient({
  projectId: "bksfw1p8",
  dataset: "development",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
if (dev.config().dataset !== "development")
  throw new Error("Refusing: not development");

const SAMPLE = '_type == "event" && title match "Sample:*"';

const existing = await dev.fetch<string[]>(`*[${SAMPLE}]._id`);
if (process.argv.includes("--remove")) {
  const tx = dev.transaction();
  for (const id of existing) tx.delete(id);
  await tx.commit();
  console.log(`Removed ${existing.length} sample events.`);
  process.exit(0);
}
if (existing.length) {
  console.log(`${existing.length} sample events already exist; nothing added.`);
  process.exit(0);
}

const topics = await dev.fetch<Record<string, string>>(
  '{"community": *[_type=="topic" && slug.current=="community-activities"][0]._id, "health": *[_type=="topic" && slug.current=="health-wellness"][0]._id, "money": *[_type=="topic" && slug.current=="money-benefits"][0]._id, "caregiving": *[_type=="topic" && slug.current=="caregiving"][0]._id}',
);

/** Arizona is UTC-7 all year. */
const at = (daysFromNow: number, hour: number, minute = 0) => {
  const d = new Date(Date.now() + daysFromNow * 86_400_000);
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Phoenix",
  }).format(d);
  return `${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-07:00`;
};
const NOTE = "Sample event for the demonstration. Not a real event.";
const slug = (text: string) => ({
  _type: "slug",
  current: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
});
const ref = (id?: string) =>
  id ? [{ _type: "reference", _ref: id, _key: id.slice(0, 8) }] : [];

const events = [
  { title: "Sample: Coffee and conversation", days: 2, hour: 9, length: 1.5, topic: topics.community, repeat: "weekly", msl: true, summary: `A relaxed weekly get-together. ${NOTE}` },
  { title: "Sample: Medicare open enrollment help", days: 4, hour: 10, length: 2, topic: topics.money, summary: `One-to-one help comparing plans. ${NOTE}` },
  { title: "Sample: Chair yoga", days: 5, hour: 8, minute: 30, length: 1, topic: topics.health, repeat: "weekly", summary: `Gentle seated exercise for all abilities. ${NOTE}` },
  { title: "Sample: Caregiver support group", days: 9, hour: 13, length: 1.5, topic: topics.caregiving, summary: `Share what works with other caregivers. ${NOTE}` },
  { title: "Sample: Holiday lunch", days: 24, hour: 11, minute: 30, length: 2, topic: topics.community, msl: true, summary: `A festive lunch with music. ${NOTE}` },
];

const tx = dev.transaction();
for (const e of events) {
  const start = at(e.days, e.hour, e.minute ?? 0);
  const end = new Date(new Date(start).getTime() + e.length * 3_600_000).toISOString();
  // No _id: Sanity generates one.
  tx.create({
    _type: "event",
    title: e.title,
    slug: slug(e.title),
    start: new Date(start).toISOString(),
    end,
    allDay: false,
    repeat: { frequency: e.repeat ?? "none" },
    location: "Sample venue, Maricopa",
    attendance: "inPerson",
    status: "scheduled",
    hostedByMsl: Boolean(e.msl),
    isFree: true,
    summary: e.summary,
    topics: ref(e.topic),
  });
}
const result = await tx.commit();
console.log(`Added ${result.results.length} sample events to development.`);
