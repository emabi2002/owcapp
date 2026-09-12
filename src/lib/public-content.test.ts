import { describe, expect, test } from "bun:test";

describe("OWC mobile public content adapters", () => {
  test("loads normalized news through the OWC public API", async () => {
    const api = (await import("./api")) as Record<string, unknown>;
    const getPublicNews = api.getPublicNews as
      | undefined
      | ((options: Record<string, unknown>) => Promise<Record<string, unknown>>);

    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          items: [
            {
              id: "n1",
              slug: "owc-update",
              category: "Announcement",
              date: "2026-09-12",
              title: "OWC update",
              excerpt: "Public update",
              body: "Details",
              image: "/news.jpg",
              featured: true,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const result = await getPublicNews?.({
      baseUrl: "https://owc.gov.pg",
      fetchImpl,
    });

    expect(result?.source).toBe("owc-api");
    expect((result?.items as Array<{ slug?: string }>)[0]?.slug).toBe("owc-update");
  });

  test("loads public forms and preserves the OWC download URL", async () => {
    const api = (await import("./api")) as Record<string, unknown>;
    const getPublicForms = api.getPublicForms as
      | undefined
      | ((options: Record<string, unknown>) => Promise<Record<string, unknown>>);

    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          items: [
            {
              id: "f1",
              code: "WC-1",
              title: "Worker Application",
              category: "Claims",
              format: "PDF",
              size: "248 KB",
              updated: "2026-09-12",
              fileUrl: "/forms/wc-1.pdf",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const result = await getPublicForms?.({
      baseUrl: "https://owc.gov.pg",
      fetchImpl,
    });

    expect(result?.source).toBe("owc-api");
    expect((result?.items as Array<{ code?: string }>)[0]?.code).toBe("WC-1");
    expect((result?.items as Array<{ fileUrl?: string }>)[0]?.fileUrl).toBe(
      "/forms/wc-1.pdf",
    );
  });
});
