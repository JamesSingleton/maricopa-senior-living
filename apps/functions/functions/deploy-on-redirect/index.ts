import { documentEventHandler } from "@sanity/functions";

/**
 * The website reads Redirect documents when it builds, so any change to a
 * redirect triggers a new Vercel deployment via its deploy hook.
 *
 *   npx sanity@latest functions env add deploy-on-redirect DEPLOY_HOOK_URL https://api.vercel.com/v1/integrations/deploy/…
 */
export const handler = documentEventHandler(async () => {
  const url = process.env.DEPLOY_HOOK_URL;
  if (!url) throw new Error("DEPLOY_HOOK_URL is not set");
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) throw new Error(`Deploy hook failed (${response.status})`);
  console.log("Triggered a website deployment for redirect changes");
});
