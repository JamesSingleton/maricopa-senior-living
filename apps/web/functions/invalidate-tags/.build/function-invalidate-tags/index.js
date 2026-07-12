//#region ../../node_modules/.pnpm/@sanity+functions@1.4.0_@aws-lite+client@0.23.7_@aws-lite+dynamodb@0.3.9_@aws-lite+lamb_7510397bbcd438f438e3fa6c16e3aa35/node_modules/@sanity/functions/dist/definers.js
/**
* Defines a "sync tag invalidate event" function handler.
* Returns the handler function as-is, only providing the types and doing basic validation.
*
* @param handler - The event handler function to use.
* @returns The handler function, unmodified.
*/
function syncTagInvalidateEventHandler(handler) {
	if (typeof handler !== "function") throw new TypeError("`handler` must be a function");
	return handler;
}
//#endregion
//#region functions/invalidate-tags/index.ts
function normalizeSiteUrl(raw) {
	if (raw.startsWith("http://") || raw.startsWith("https://")) return raw.replace(/\/$/, "");
	return `https://${raw.replace(/\/$/, "")}`;
}
var handler = syncTagInvalidateEventHandler(async ({ event, done }) => {
	const syncTags = event.data.syncTags ?? [];
	const siteUrl = process.env.SITE_URL;
	const secret = process.env.SANITY_REVALIDATE_SECRET;
	if (!siteUrl) throw new Error("Missing SITE_URL for expire-tags endpoint");
	if (!secret) throw new Error("Missing SANITY_REVALIDATE_SECRET for expire-tags auth");
	const response = await fetch(`${normalizeSiteUrl(siteUrl)}/api/expire-tags`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-sanity-revalidate-secret": secret
		},
		body: JSON.stringify({ syncTags })
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`expire-tags failed (${response.status}): ${body || response.statusText}`);
	}
	try {
		const doneResponse = await done(syncTags);
		console.log(`Invalidated ${syncTags.length} sync tags; Sanity done status ${doneResponse.status}`);
	} catch (error) {
		console.error("Error invoking Sanity invalidation done endpoint", error);
		throw error;
	}
});
//#endregion
export { handler };

//# sourceMappingURL=index.js.map