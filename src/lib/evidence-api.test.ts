import { describe, expect, test } from "bun:test";

describe("OWC mobile evidence API adapter", () => {
  test("uploads a claim evidence file with the short-lived OWC bearer token", async () => {
    const evidenceApi = (await import("./evidence-api")) as Record<string, unknown>;
    const uploadClaimEvidence = evidenceApi.uploadClaimEvidence as
      | undefined
      | ((
          input: {
            claimReference: string;
            uploadToken: string;
            file: File;
            title: string;
            category?: string;
          },
          options: Record<string, unknown>,
        ) => Promise<Record<string, unknown>>);

    expect(typeof uploadClaimEvidence).toBe("function");
    if (!uploadClaimEvidence) return;

    let requestedUrl = "";
    let authorization = "";
    let submittedTitle = "";
    let submittedCategory = "";
    let submittedFileName = "";

    const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      const form = init?.body as FormData;
      submittedTitle = String(form.get("title") ?? "");
      submittedCategory = String(form.get("category") ?? "");
      const file = form.get("file");
      submittedFileName = file instanceof File ? file.name : "";

      return new Response(
        JSON.stringify({
          claimReference: "OWC-2026-005999",
          fileName: "medical.pdf",
          status: "Pending Review",
          securityScan: "clean",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await uploadClaimEvidence(
      {
        claimReference: "OWC-2026-005999",
        uploadToken: "signed-evidence-token",
        file: new File(["medical evidence"], "medical.pdf", {
          type: "application/pdf",
        }),
        title: "Medical report",
        category: "Medical",
      },
      { baseUrl: "https://owc.gov.pg", fetchImpl },
    );

    expect(requestedUrl).toBe(
      "https://owc.gov.pg/api/claims/OWC-2026-005999/evidence",
    );
    expect(authorization).toBe("Bearer signed-evidence-token");
    expect(submittedTitle).toBe("Medical report");
    expect(submittedCategory).toBe("Medical");
    expect(submittedFileName).toBe("medical.pdf");
    expect(result.status).toBe("Pending Review");
    expect(result.source).toBe("owc-api");
  });
});
