import { afterEach, describe, expect, test } from "bun:test";
import { GET as getNews } from "./news/route";
import { GET as getForms } from "./forms/route";

const originalFetch = globalThis.fetch;
const originalBase = process.env.OWC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
  else process.env.OWC_API_BASE_URL = originalBase;
});

describe("OWC public content proxies", () => {
  test("returns news supplied by the authoritative OWC API", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => new Response(JSON.stringify({ items: [{
      id: "1",
      slug: "notice",
      category: "Announcement",
      date: "2026-09-13",
      title: "OWC Notice",
      excerpt: "Official notice",
      image: "/notice.jpg",
      featured: true,
    }] }), { status: 200, headers: { "content-type": "application/json" } });

    const response = await getNews();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.items[0].slug).toBe("notice");
  });

  test("returns forms supplied by the authoritative OWC API", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => new Response(JSON.stringify({ items: [{
      id: "emp-2",
      code: "EMP-2",
      title: "Employer Report of Injury",
      category: "Employer",
      format: "PDF",
      size: "240 KB",
      updated: "2026-09-13",
      fileUrl: "https://owc.example.gov.pg/forms/emp-2.pdf",
    }] }), { status: 200, headers: { "content-type": "application/json" } });

    const response = await getForms();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.items[0].code).toBe("EMP-2");
  });

  test("fails closed when OWC public content is unavailable", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => { throw new Error("network down"); };

    expect((await getNews()).status).toBe(503);
    expect((await getForms()).status).toBe(503);
  });
});
