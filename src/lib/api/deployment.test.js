import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

describe("OWC mobile deployment boundary", () => {
  test("uses a Next server runtime so same-origin OWC API routes are available", async () => {
    const config = await readFile("next.config.js", "utf8");
    expect(config.includes('output: "export"')).toBe(false);
    expect(config.includes('distDir: "out"')).toBe(false);
  });

  test("does not disable Netlify's Next runtime", async () => {
    const netlify = await readFile("netlify.toml", "utf8");
    expect(netlify.includes("NETLIFY_NEXT_PLUGIN_SKIP")).toBe(false);
    expect(netlify.includes('publish = "out"')).toBe(false);
  });

  test("keeps the authoritative OWC API base URL server-only", async () => {
    const example = await readFile(".env.example", "utf8");
    expect(example.includes("OWC_API_BASE_URL=")).toBe(true);
    expect(example.includes("NEXT_PUBLIC_OWC_API_BASE_URL")).toBe(false);
  });
});
