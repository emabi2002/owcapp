import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalBase = process.env.OWC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
  else process.env.OWC_API_BASE_URL = originalBase;
});

const request = (body) => new Request("http://localhost/api/owc/injuries", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const valid = {
  employerName: "Pacific Engineering Ltd",
  workerName: "Mara Kila",
  injuryDate: "2026-09-01",
  description: "Worker sustained an injury while moving equipment.",
};

describe("POST /api/owc/injuries", () => {
  test("rejects incomplete reports", async () => {
    expect((await POST(request({ employerName: "Pacific Engineering Ltd" }))).status).toBe(400);
  });

  test("returns the OWC injury reference", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => new Response(JSON.stringify({
      ok: true,
      reference: "INJ-2026-123456",
    }), { status: 200, headers: { "content-type": "application/json" } });

    const response = await POST(request(valid));
    const json = await response.json();
    expect(response.status).toBe(201);
    expect(json.reference).toBe("INJ-2026-123456");
  });
});
