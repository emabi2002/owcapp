import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";

const originalFetch = globalThis.fetch;
const originalBase = process.env.OWC_API_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBase === undefined) delete process.env.OWC_API_BASE_URL;
  else process.env.OWC_API_BASE_URL = originalBase;
});

function uploadRequest({ reference = "OWC-2026-005112", token = "grant-token", title = "Medical certificate", category = "Medical", file = new File(["clinical note"], "certificate.pdf", { type: "application/pdf" }) } = {}) {
  const form = new FormData();
  form.set("reference", reference);
  form.set("token", token);
  form.set("title", title);
  form.set("category", category);
  form.set("file", file);

  return new Request("http://localhost/api/owc/claims/evidence", {
    method: "POST",
    body: form,
  });
}

describe("POST /api/owc/claims/evidence", () => {
  test("forwards claimant evidence as multipart data with the short-lived OWC grant", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";

    let capturedUrl = "";
    let capturedInit;
    globalThis.fetch = async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return new Response(JSON.stringify({
        claimReference: "OWC-2026-005112",
        title: "Medical certificate",
        category: "Medical",
        fileName: "certificate.pdf",
        status: "Pending Review",
        securityScan: "clean",
      }), {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    };

    const response = await POST(uploadRequest());
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.status).toBe("Pending Review");
    expect(capturedUrl).toBe("https://owc.example.gov.pg/api/claims/OWC-2026-005112/evidence");
    expect(capturedInit.headers.authorization).toBe("Bearer grant-token");
    expect(capturedInit.body).toBeInstanceOf(FormData);
    expect(capturedInit.body.get("title")).toBe("Medical certificate");
    expect(capturedInit.body.get("category")).toBe("Medical");
    expect(capturedInit.body.get("file")).toBeInstanceOf(File);
    expect(capturedInit.headers["content-type"]).toBeUndefined();
  });

  test("rejects an upload without claim reference, grant token, title or file", async () => {
    const response = await POST(uploadRequest({ reference: "", token: "", title: "", file: new Blob([]) }));
    expect(response.status).toBe(400);
  });

  test("fails closed when OWC evidence storage is unavailable", async () => {
    process.env.OWC_API_BASE_URL = "https://owc.example.gov.pg";
    globalThis.fetch = async () => {
      throw new Error("network down");
    };

    const response = await POST(uploadRequest());
    expect(response.status).toBe(503);
  });
});
