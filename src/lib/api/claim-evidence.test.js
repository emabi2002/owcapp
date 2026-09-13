import { afterEach, describe, expect, test } from "bun:test";
import { evidenceUploadOutcome, uploadClaimEvidence } from "./claim-evidence";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("uploadClaimEvidence", () => {
  test("posts one evidence file through the same-origin OWC proxy", async () => {
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

    const file = new File(["clinical note"], "certificate.pdf", { type: "application/pdf" });
    const result = await uploadClaimEvidence({
      reference: "OWC-2026-005112",
      token: "grant-token",
      file,
      title: "Medical certificate",
      category: "Medical",
    });

    expect(capturedUrl).toBe("/api/owc/claims/evidence");
    expect(capturedInit.method).toBe("POST");
    expect(capturedInit.body).toBeInstanceOf(FormData);
    expect(capturedInit.body.get("reference")).toBe("OWC-2026-005112");
    expect(capturedInit.body.get("token")).toBe("grant-token");
    expect(capturedInit.body.get("file")).toBeInstanceOf(File);
    expect(result.status).toBe("Pending Review");
  });

  test("surfaces the OWC upload error without marking the file successful", async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Evidence file failed security scanning" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });

    const file = new File(["unsafe"], "certificate.pdf", { type: "application/pdf" });

    await expect(uploadClaimEvidence({
      reference: "OWC-2026-005112",
      token: "grant-token",
      file,
      title: "Medical certificate",
      category: "Medical",
    })).rejects.toThrow("Evidence file failed security scanning");
  });
});

describe("evidenceUploadOutcome", () => {
  test("distinguishes a complete upload from a partial failure", () => {
    expect(evidenceUploadOutcome(3, 0)).toBe("complete");
    expect(evidenceUploadOutcome(3, 1)).toBe("partial");
    expect(evidenceUploadOutcome(0, 0)).toBe("none");
  });
});
