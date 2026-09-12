import type {
  UploadClaimEvidenceInput,
  UploadClaimEvidenceResult,
} from "@/lib/evidence-api";

export type EvidenceUploadFailure = {
  fileName: string;
  error: string;
};

export type EvidenceUploadSummary = {
  total: number;
  uploaded: number;
  failed: number;
  failures: EvidenceUploadFailure[];
};

type UploadOne = (
  input: UploadClaimEvidenceInput,
) => Promise<UploadClaimEvidenceResult | Record<string, unknown>>;

export async function uploadSelectedEvidence(input: {
  claimReference: string;
  uploadToken: string;
  files: File[];
  uploadOne: UploadOne;
  onProgress?: (completed: number, total: number) => void;
}): Promise<EvidenceUploadSummary> {
  const failures: EvidenceUploadFailure[] = [];
  let uploaded = 0;

  for (const file of input.files) {
    try {
      await input.uploadOne({
        claimReference: input.claimReference,
        uploadToken: input.uploadToken,
        file,
        title: file.name,
        category: "Other",
      });
      uploaded += 1;
    } catch (error) {
      failures.push({
        fileName: file.name,
        error: error instanceof Error ? error.message : "Evidence upload failed",
      });
    } finally {
      input.onProgress?.(uploaded + failures.length, input.files.length);
    }
  }

  return {
    total: input.files.length,
    uploaded,
    failed: failures.length,
    failures,
  };
}
