import { describe, expect, test } from "bun:test";

describe("claim evidence upload flow", () => {
  test("uploads every selected file and reports successful completion", async () => {
    const module = (await import("./claim-evidence-flow")) as Record<string, unknown>;
    const uploadSelectedEvidence = module.uploadSelectedEvidence as
      | undefined
      | ((input: {
          claimReference: string;
          uploadToken: string;
          files: File[];
          uploadOne: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
          onProgress?: (completed: number, total: number) => void;
        }) => Promise<Record<string, unknown>>);

    expect(typeof uploadSelectedEvidence).toBe("function");
    if (!uploadSelectedEvidence) return;

    const uploaded: string[] = [];
    const progress: string[] = [];
    const result = await uploadSelectedEvidence({
      claimReference: "OWC-2026-005999",
      uploadToken: "grant-token",
      files: [
        new File(["medical"], "medical.pdf", { type: "application/pdf" }),
        new File(["id"], "identity.jpg", { type: "image/jpeg" }),
      ],
      uploadOne: async (input) => {
        const file = input.file as File;
        uploaded.push(file.name);
        return { fileName: file.name, status: "Pending Review" };
      },
      onProgress: (completed, total) => progress.push(`${completed}/${total}`),
    });

    expect(uploaded).toEqual(["medical.pdf", "identity.jpg"]);
    expect(progress).toEqual(["1/2", "2/2"]);
    expect(result).toEqual({ total: 2, uploaded: 2, failed: 0, failures: [] });
  });

  test("keeps the lodged claim valid when one evidence file fails", async () => {
    const module = (await import("./claim-evidence-flow")) as Record<string, unknown>;
    const uploadSelectedEvidence = module.uploadSelectedEvidence as
      | undefined
      | ((input: {
          claimReference: string;
          uploadToken: string;
          files: File[];
          uploadOne: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
        }) => Promise<Record<string, unknown>>);

    expect(typeof uploadSelectedEvidence).toBe("function");
    if (!uploadSelectedEvidence) return;

    const result = await uploadSelectedEvidence({
      claimReference: "OWC-2026-005999",
      uploadToken: "grant-token",
      files: [
        new File(["medical"], "medical.pdf", { type: "application/pdf" }),
        new File(["bad"], "photo.jpg", { type: "image/jpeg" }),
      ],
      uploadOne: async (input) => {
        const file = input.file as File;
        if (file.name === "photo.jpg") throw new Error("Security scan unavailable");
        return { fileName: file.name, status: "Pending Review" };
      },
    });

    expect(result).toEqual({
      total: 2,
      uploaded: 1,
      failed: 1,
      failures: [{ fileName: "photo.jpg", error: "Security scan unavailable" }],
    });
  });
});
