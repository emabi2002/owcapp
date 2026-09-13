import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalBase = process.env.OWC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
  else process.env.OWC_API_BASE_URL = originalBase;
});

function request(body) {
  return new Request("http://localhost/api/owc/claims/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/owc/claims/track", () => {
  test("rejects an empty reference", async () => {
    const response = await POST(request({ reference: "" }));
    expect(response.status).toBe(400);
  });

  test("returns a normalized claim from the authoritative OWC API", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          found: true,
          claim: {
            reference: "OWC-2026-004821",
            status: "New",
            type: "Workplace Injury",
            employer: "Highlands Construction Ltd",
            lodged: "8 Sep 2026",
            injuryDate: "6 Sep 2026",
            worker: "J. Kaupa",
            steps: [{ label: "Claim received", done: true, date: "8 Sep 2026" }],
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );

    const response = await POST(request({ reference: "OWC-2026-004821" }));
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.claim.reference).toBe("OWC-2026-004821");
    expect(json.claim.status).toBe("Received");
  });

  test("maps not-found results to 404", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ found: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });

    const response = await POST(request({ reference: "OWC-2026-999999" }));
    expect(response.status).toBe(404);
  });

  test("fails closed when the OWC API is unavailable", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => {
      throw new Error("network down");
    };

    const response = await POST(request({ reference: "OWC-2026-004821" }));
    expect(response.status).toBe(503);
  });
});
