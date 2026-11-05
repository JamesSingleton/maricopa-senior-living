import { createClient } from "@sanity/client";
import { documentEventHandler } from "@sanity/functions";

/** Website path prefix for each type with a slug. Must match apps/web routes. */
const PREFIX: Record<string, string> = {
  page: "",
  article: "/articles",
  resource: "/resources",
  event: "/events",
  topic: "/topics",
  author: "/writers",
};

type SlugChange = {
  _type: string;
  oldSlug?: string | null;
  newSlug?: string | null;
};

/**
 * When a published web address changes, keep the old one working:
 * - add a Redirect from the old path to the new one,
 * - point existing redirects at the new path (no chains),
 * - remove any redirect *from* the new path (it would loop).
 */
export const handler = documentEventHandler<SlugChange>(
  async ({ context, event }) => {
    const { _type, oldSlug, newSlug } = event.data;
    const prefix = PREFIX[_type];
    if (prefix === undefined || !oldSlug || !newSlug || oldSlug === newSlug)
      return;

    const from = `${prefix}/${oldSlug}`;
    const to = `${prefix}/${newSlug}`;
    const client = createClient({
      ...context.clientOptions,
      apiVersion: "2025-05-08",
    });

    const [existing, pointingAtOld, fromNew] = await Promise.all([
      client.fetch<string | null>(
        '*[_type == "redirect" && source == $from][0]._id',
        { from },
      ),
      client.fetch<string[]>(
        '*[_type == "redirect" && destination == $from]._id',
        { from },
      ),
      client.fetch<string[]>('*[_type == "redirect" && source == $to]._id', {
        to,
      }),
    ]);

    const tx = client.transaction();
    if (existing) {
      tx.patch(existing, (p) => p.set({ destination: to, permanent: true }));
    } else {
      tx.create({
        _type: "redirect",
        source: from,
        destination: to,
        permanent: true,
      });
    }
    for (const id of pointingAtOld)
      tx.patch(id, (p) => p.set({ destination: to }));
    for (const id of fromNew) tx.delete(id);

    await tx.commit();
    console.log(
      `Redirect ${from} → ${to} (updated ${pointingAtOld.length}, removed ${fromNew.length})`,
    );
  },
);
