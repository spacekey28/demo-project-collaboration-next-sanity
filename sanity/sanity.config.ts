import { defineConfig } from "sanity";

import { schemaTypes } from "./schemas";

// Sanity Studio configuration
// Project ID and dataset should come from env; fall back to placeholders for local dev
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Flowspace CMS",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
});
