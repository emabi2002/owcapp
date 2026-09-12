import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";

describe("OWC PWA cache policy", () => {
  test("service worker explicitly bypasses API requests", async () => {
    const serviceWorker = await readFile("public/sw.js", "utf8");
    expect(serviceWorker.includes('url.pathname.startsWith("/api/")')).toBe(true);
  });
});
