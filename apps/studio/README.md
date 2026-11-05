# Maricopa Senior Living — Studio

The content editor Ron uses, at **studio.maricopaseniorliving.org**. It
replaces the Studio that used to be embedded in the website at `/admin`
(which now redirects here).

## Run it locally

```bash
pnpm --filter ./apps/studio exec sanity dev --port 3333
```

It uses the **development** dataset unless `SANITY_STUDIO_DATASET` says
otherwise, and never falls back to production.

| Variable                       | Purpose                  | Local                      | Production                             |
| ------------------------------ | ------------------------ | -------------------------- | -------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`     | Sanity project           | `bksfw1p8`                 | `bksfw1p8`                             |
| `SANITY_STUDIO_DATASET`        | Content dataset          | `development`              | the live dataset                       |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | Website shown in Preview | `http://localhost:3000`    | `https://www.maricopaseniorliving.org` |
| `SANITY_STUDIO_SITE_URL`       | Base for "Copy link"     | (default is the live site) | `https://www.maricopaseniorliving.org` |
| `SANITY_STUDIO_TITLE`          | Name in the browser tab  | optional                   | `Maricopa Senior Living`               |

## Deploy the Studio (Vercel)

1. New Vercel project from this repo, **Root Directory** `apps/studio`.
   `vercel.json` sets the build (`sanity build` → `dist`) and the single-page
   rewrite.
2. Add the variables above (Production environment).
3. Add the domain `studio.maricopaseniorliving.org` in Vercel and a `CNAME`
   at the DNS provider.
4. In sanity.io/manage → API → CORS origins, add
   `https://studio.maricopaseniorliving.org` **with credentials allowed**.
5. On the website project, set `NEXT_PUBLIC_SANITY_STUDIO_URL` to
   `https://studio.maricopaseniorliving.org` (used for click-to-edit, the
   `/admin` redirect and the CSP `frame-ancestors`).

## Schema and types

```bash
pnpm --filter ./apps/studio exec sanity schema deploy      # for Sanity's tools/agents
pnpm --filter ./apps/studio exec sanity schema extract --enforce-required-fields --force
pnpm --filter ./apps/studio exec sanity typegen generate   # → packages/sanity/src/types.ts
```

## Functions (`apps/functions`)

Kept outside the Studio, as Sanity recommends. They target **production**
unless `BLUEPRINT_DATASET` is set.

- `invalidate-tags` — refreshes the website's cache when content changes.
- `auto-redirect` — when a published web address (slug) changes, adds a
  Redirect from the old address and fixes older redirects.
- `deploy-on-redirect` — redeploys the website when a Redirect changes
  (redirects are built into the site). Needs the Vercel deploy hook:

```bash
cd apps/functions
npx sanity@latest functions env add deploy-on-redirect DEPLOY_HOOK_URL https://api.vercel.com/v1/integrations/deploy/…
pnpm plan     # review
pnpm deploy   # apply
```

## Ron's account

Invite Ron with the **Editor** role (not Administrator). Editors can't see
Site setup (topics, menus, settings, redirects), the query tool, or delete
the home page/settings/menus.

## Cutover checklist (from the old site)

1. Create the target dataset (e.g. `production-v2`) and run the migration
   into it: `scripts/migrate/index.ts`, then the `patch-*` scripts in date
   order (they are written for `development`; change the target and its
   guard deliberately).
2. Deploy the schema to that dataset; deploy the Studio pointing at it.
3. Ron does a first pass of "Needs review" and "Due for checking".
4. Point the website's `NEXT_PUBLIC_SANITY_DATASET` and the Functions'
   `BLUEPRINT_DATASET` at it; redeploy both.
5. Check old URLs redirect (`/category/…`, `/tag/…`, `/articles/…`, `/admin`).
