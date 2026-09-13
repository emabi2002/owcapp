import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalBase = process.env.OWC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
  else process.env.OWC_API_BASE_URL = originalBase;
});

const request = (body) => new Request("http://localhost/api/owc/employers/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

describe("POST /api/owc/employers/verify", () => {
  test("rejects empty queries", async () => {
    expect((await POST(request({ query: "" }))).status).toBe(400);
  });

  test("normalizes an employer verification result", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => new Response(JSON.stringify({
      ok: true,
      result: { registered: true, name: "Pacific Engineering Ltd", registrationNo: "EMP-10001", status: "Compliant" },
    }), { status: 200, headers: { "content-type": "application/json" } });

    const response = await POST(request({ query: "Pacific Engineering Ltd" }));
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.registered).toBe(true);
    expect(json.registrationNumber).toBe("EMP-10001");
  });
});
