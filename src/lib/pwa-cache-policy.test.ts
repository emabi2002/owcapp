import { describe, expect, test } from "bun:test";

describe("OWC PWA cache policy", () => {
  test("service worker explicitly bypasses API requests", async () => {
    const serviceWorker = await Bun.file("public/sw.js").text();
    expect(serviceWorker.includes('url.pathname.startsWith("/api/")')).toBe(true);
  });
});
