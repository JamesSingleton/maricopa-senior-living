# Demo script: the rebuilt Maricopa Senior Living

For James, showing Ron. About 20 minutes. The point to land: **people
weren't failing to care about the site, they were failing to find things on
it, and the new one fixes that without giving Ron more work.**

Everything here runs on your laptop against the **development** copy of the
content. The live site is untouched.

## Before he arrives

Start both, each in its own terminal tab:

```bash
pnpm --filter ./apps/web exec next dev -p 3000
```

```bash
pnpm --filter ./apps/studio exec sanity dev --port 3333
```

- Website: http://localhost:3000 (use port 3000; on another port the live
  refresh is blocked)
- Studio: http://localhost:3333, signed in as yourself
- Keep the current live site open in another tab for the comparison
- Five events titled "Sample: …" are in the development content so Events
  isn't empty. Tell Ron they're placeholders. Remove them afterwards with
  `node --env-file=../web/.env.local scripts/demo/sample-events.ts --remove`
  from `apps/studio`.

Old-site numbers below were counted from the production content in early
November 2026.

## 1. The problem, in his words (2 min)

On the **live site**, ask Ron to find a ride to a medical appointment.

- 81 categories and 311 tags to scroll through
- About 117 outside links in the menus
- All 185 posts filed under What's New, one of them 813 blocks long

Say: "Nobody could find anything, so nobody came back. That isn't a reason
to close it."

## 2. Finding help on the new site (6 min)

On **http://localhost:3000**, same task.

1. **Home page.** One search box, and "People often look for" shortcuts.
   Click **Rides**.
2. Back home. Scroll to **What do you need help with?** 14 numbered topics
   replace the 81 categories and 311 tags. Click **11 Getting Around**.
3. **Topic page.** Places to call come first, nearest first: In Maricopa,
   then Pinal County, Arizona, national. Every card has a green **Call**
   button with the number on it.
4. Open one resource: phone, hours, address, and when it was last checked.
5. Point at the top strip: **911, 988, 211** on every page.
6. Point at the menu: six plain links, no drop-downs, and the one you're in
   is underlined.

## 3. On a phone (2 min)

In the browser pane's Viewport menu choose **Mobile** (or shrink the
window).

- Text stays large, buttons stay big, nothing scrolls sideways
- One **Menu** button holds search and the six sections
- Tapping a Call button dials

## 4. Ron's side: the Studio (7 min)

On **http://localhost:3333**.

1. **Start here.** His monthly jobs as big boxes: next month's What's New,
   add an event, add a resource, add a helpful link, write an article, next
   month's newsletter, add a page.
2. Click **Add a resource.** Show the plain help at the top, the three
   tabs, and that phone numbers go in one at a time so the Call button
   works. Type the name of a resource that exists: it warns about a
   duplicate. Close without publishing.
3. **How things stand** (bottom of Start here). The Studio tells him what
   needs attention: 904 items brought over that need a quick look, 222
   resources not checked in a year.
4. **Topics** tab. Every topic with its counts, a search box, and warnings:
   - Community & Activities is flagged as crowded (291 items)
   - six publishers are spelled two ways, e.g. "CDC" and "cdc.gov"
   Say: "This is what stops it growing back into 81 categories."
5. Click a count, e.g. **64 places to call**: it opens that exact list.

## 5. The nonprofit (2 min)

1. Start here → **Pages for the nonprofit**: Donate, Volunteer, Board &
   documents. Open **Donate page**: it arrives with the sections in place.
2. Site setup → Site settings → **Nonprofit & donations**: mission, EIN,
   giving by check. The EIN is empty today and the dashboard says so.

Ask Ron for: the EIN, the mission in a sentence or two, board names, and
how to give by check.

## 6. What it needs from Ron (1 min)

- A first pass through **Needs review** (a little at a time is fine)
- Real events, entered as events rather than inside What's New
- Decide whether Community & Activities should be split in two

## If he asks

- **"Is my content gone?"** No. 222 resources, 576 helpful links, 106
  articles and 20 newsletters came across. Archived posts did not.
- **"Can I break it?"** The menus, topics and settings are locked to James.
  Nothing goes live until he presses Publish.
- **"Will Google find it?"** Page titles, descriptions and the sitemap are
  automatic, and old addresses redirect to the new ones. We have not yet
  checked this against the site's visitor statistics.
- **"When does it go live?"** Not decided. It needs his review pass and a
  cutover day first.
