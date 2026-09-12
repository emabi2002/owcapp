import { describe, expect, test } from "bun:test";

describe("OWC mobile API client", () => {
  test("builds normalized OWC API URLs", async () => {
    const api = await import("./api");
    expect(api.buildOwcApiUrl("/api/claims/track", "https://owc.gov.pg/")).toBe(
      "https://owc.gov.pg/api/claims/track",
    );
  });

  test("tracks a claim through the configured OWC API and normalizes New to Received", async () => {
    const api = (await import("./api")) as Record<string, unknown>;
    const trackClaim = api.trackClaim as
      | undefined
      | ((input: { reference: string }, options: Record<string, unknown>) => Promise<Record<string, unknown>>);

    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          found: true,
          claim: {
            reference: "OWC-2026-005112",
            worker: "Mara Kila",
            employer: "Pacific Engineering Ltd",
            injuryDate: "2026-09-10",
            lodged: "2026-09-12",
            type: "Workplace limb injury",
            status: "New",
            steps: [{ label: "Claim received", done: true, date: "2026-09-12" }],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const result = await trackClaim?.(
      { reference: "OWC-2026-005112" },
      { baseUrl: "https://owc.gov.pg", fetchImpl },
    );

    expect(result?.found).toBe(true);
    expect((result?.claim as { status?: string })?.status).toBe("Received");
    expect(result?.source).toBe("owc-api");
  });

  test("uses deterministic local claim data when the OWC API is not configured", async () => {
    const api = (await import("./api")) as Record<string, unknown>;
    const trackClaim = api.trackClaim as
      | undefined
      | ((input: { reference: string }, options?: Record<string, unknown>) => Promise<Record<string, unknown>>);

    const result = await trackClaim?.(
      { reference: "OWC-2026-004821" },
      { baseUrl: "" },
    );

    expect(result?.found).toBe(true);
    expect((result?.claim as { reference?: string })?.reference).toBe("OWC-2026-004821");
    expect(result?.source).toBe("mock");
  });
});
