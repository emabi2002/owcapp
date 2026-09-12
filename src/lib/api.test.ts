import { describe, expect, test } from "bun:test";

describe("OWC mobile API client", () => {
  test("builds normalized OWC API URLs", async () => {
    let api: Record<string, unknown> = {};
    try {
      api = await import("./api");
    } catch {
      // The implementation intentionally does not exist in the RED phase.
    }

    const build = api.buildOwcApiUrl as
      | undefined
      | ((path: string, baseUrl?: string) => string);

    expect(build?.("/api/claims/track", "https://owc.gov.pg/")).toBe(
      "https://owc.gov.pg/api/claims/track",
    );
  });
});
