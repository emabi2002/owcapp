import { describe, expect, test } from "bun:test";
import { loadPublicForms, loadPublicNews } from "./public-content";

describe("public content policy", () => {
  test("prefers authoritative remote news when available", async () => {
    const fetcher = async () => new Response(JSON.stringify({ items: [{
      id: "remote-1",
      slug: "remote-news",
      category: "Announcement",
      date: "2026-09-13",
      title: "Remote OWC News",
      excerpt: "Authoritative content",
      image: "/news.jpg",
      featured: true,
    }] }), { status: 200, headers: { "content-type": "application/json" } });

    const items = await loadPublicNews(fetcher, true);
    expect(items[0].slug).toBe("remote-news");
  });

  test("fails closed when remote news is unavailable and fallback is disabled", async () => {
    const fetcher = async () => { throw new Error("offline"); };
    await expect(loadPublicNews(fetcher, false)).rejects.toThrow("offline");
  });

  test("uses controlled local news only when fallback is explicitly enabled", async () => {
    const fetcher = async () => { throw new Error("offline"); };
    const items = await loadPublicNews(fetcher, true);
    expect(items.length).toBeGreaterThan(0);
  });

  test("uses controlled local forms only when fallback is explicitly enabled", async () => {
    const fetcher = async () => new Response("upstream unavailable", { status: 503 });
    const items = await loadPublicForms(fetcher, true);
    expect(items.length).toBeGreaterThan(0);
  });
});
