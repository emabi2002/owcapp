import { afterEach, describe, expect, test } from "bun:test";
import { owcRequest } from "./client";

describe("owcRequest", () => {
  const originalFetch = globalThis.fetch;
  const originalBase = process.env.OWC_API_BASE_URL;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
    else process.env.OWC_API_BASE_URL = originalBase;
  });

  test("joins the configured base URL and relative path", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg/";
    let requestedUrl = "";
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const result = await owcRequest<{ ok: boolean }>("/api/claims/track");

    expect(requestedUrl).toBe("https://owc.example.gov.pg/api/claims/track");
    expect(result.ok).toBe(true);
  });

  test("normalizes non-2xx JSON failures", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: "Claim not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    await expect(owcRequest("/api/claims/track")).rejects.toMatchObject({
      status: 404,
      message: "Claim not found",
    });
  });

  test("rejects malformed successful JSON responses", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = (async () =>
      new Response("not-json", {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    await expect(owcRequest("/api/claims/track")).rejects.toThrow(
      "OWC API returned an invalid JSON response"
    );
  });

  test("times out slow upstream requests", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = ((_: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      })) as typeof fetch;

    await expect(
      owcRequest("/api/claims/track", { timeoutMs: 5 } as RequestInit & { timeoutMs: number })
    ).rejects.toThrow("OWC API request timed out");
  });
});
