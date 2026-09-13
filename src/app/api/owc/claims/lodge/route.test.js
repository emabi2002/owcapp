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
  return new Request("http://localhost/api/owc/claims/lodge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validClaim = {
  name: "Mara Kila",
  phone: "+67570000001",
  employer: "Pacific Engineering Ltd",
  injuryDate: "2026-09-01",
  description: "Injured while carrying equipment at the worksite.",
};

describe("POST /api/owc/claims/lodge", () => {
  test("rejects incomplete claim details", async () => {
    const response = await POST(request({ name: "Mara" }));
    expect(response.status).toBe(400);
  });

  test("returns the authoritative OWC claim reference and evidence upload grant", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () =>
      new Response(JSON.stringify({
        ok: true,
        reference: "OWC-2026-005112",
        evidenceUploadToken: "grant-token",
        evidenceUploadExpiresInSeconds: 900,
      }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });

    const response = await POST(request(validClaim));
    const json = await response.json();
    expect(response.status).toBe(201);
    expect(json.reference).toBe("OWC-2026-005112");
    expect(json.evidenceUploadToken).toBe("grant-token");
    expect(json.evidenceUploadExpiresInSeconds).toBe(900);
  });

  test("fails closed when the OWC API is unavailable", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => {
      throw new Error("network down");
    };

    const response = await POST(request(validClaim));
    expect(response.status).toBe(503);
  });
});
