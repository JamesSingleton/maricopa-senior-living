import { env } from "@maricopa-senior-living/env/server";
import { client } from "@maricopa-senior-living/sanity/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: env.SANITY_API_READ_TOKEN }),
});
