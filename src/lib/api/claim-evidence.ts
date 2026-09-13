export const EVIDENCE_CATEGORIES = [
  "Identity",
  "Medical",
  "Employment",
  "Employer",
  "Incident",
  "Banking",
  "Correspondence",
  "Other",
] as const;

export type EvidenceCategory = (typeof EVIDENCE_CATEGORIES)[number];
export type EvidenceUploadOutcome = "none" | "complete" | "partial";

export type ClaimEvidenceUploadInput = {
  reference: string;
  token: string;
  file: File;
  title: string;
  category: EvidenceCategory;
};

export type ClaimEvidenceUploadResult = {
  claimReference: string;
  title: string;
  category: string;
  fileName: string;
  sizeBytes?: number;
  sha256?: string;
  status: string;
  securityScan?: string;
};

export function evidenceUploadOutcome(
  totalFiles: number,
  failures: number,
): EvidenceUploadOutcome {
  if (totalFiles === 0) return "none";
  return failures === 0 ? "complete" : "partial";
}

export function inferEvidenceCategory(file: File): EvidenceCategory {
  const name = file.name.toLowerCase();
  if (name.includes("med") || name.includes("doctor") || name.includes("certificate")) {
    return "Medical";
  }
  if (name.includes("payslip") || name.includes("wage") || name.includes("payroll")) {
    return "Employment";
  }
  if (name.includes("nid") || name.includes("identity") || name.includes("passport") || name.includes("licence") || name.includes("license")) {
    return "Identity";
  }
  if (name.includes("bank") || name.includes("account")) {
    return "Banking";
  }
  if (name.includes("employer") || name.includes("company")) {
    return "Employer";
  }
  if (file.type.startsWith("image/")) return "Incident";
  return "Other";
}

export async function uploadClaimEvidence(
  input: ClaimEvidenceUploadInput,
): Promise<ClaimEvidenceUploadResult> {
  const body = new FormData();
  body.set("reference", input.reference);
  body.set("token", input.token);
  body.set("title", input.title);
  body.set("category", input.category);
  body.set("file", input.file, input.file.name);

  const response = await fetch("/api/owc/claims/evidence", {
    method: "POST",
    body,
  });
  const payload = (await response.json().catch(() => ({}))) as
    | ClaimEvidenceUploadResult
    | { error?: string };

  if (!response.ok) {
    const message = "error" in payload && payload.error
      ? payload.error
      : "The supporting document could not be uploaded.";
    throw new Error(message);
  }

  return payload as ClaimEvidenceUploadResult;
}
