import { buildOwcApiUrl, isOwcApiConfigured } from "@/lib/api";

const DEFAULT_OWC_API_BASE_URL = process.env.NEXT_PUBLIC_OWC_API_BASE_URL?.trim() ?? "";

type FetchLike = typeof fetch;

type EvidenceApiOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

export type EvidenceCategory =
  | "Identity"
  | "Medical"
  | "Employment"
  | "Employer"
  | "Incident"
  | "Banking"
  | "Correspondence"
  | "Other";

export type UploadClaimEvidenceInput = {
  claimReference: string;
  uploadToken: string;
  file: File;
  title: string;
  category?: EvidenceCategory;
};

export type UploadClaimEvidenceResult = {
  claimReference: string;
  fileName: string;
  status: "Pending Review" | "Verified" | "Rejected";
  securityScan?: string;
  source: "owc-api";
};

export async function uploadClaimEvidence(
  input: UploadClaimEvidenceInput,
  options: EvidenceApiOptions = {},
): Promise<UploadClaimEvidenceResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_OWC_API_BASE_URL;
  if (!isOwcApiConfigured(baseUrl)) {
    throw new Error("OWC evidence upload requires a configured OWC API.");
  }
  if (!input.uploadToken.trim()) {
    throw new Error("Evidence upload authorization is missing or expired.");
  }

  const form = new FormData();
  form.set("file", input.file);
  form.set("title", input.title.trim() || input.file.name);
  form.set("category", input.category ?? "Other");

  const fetchImpl = options.fetchImpl ?? fetch;
  const reference = encodeURIComponent(input.claimReference.trim().toUpperCase());
  const response = await fetchImpl(
    buildOwcApiUrl(`/api/claims/${reference}/evidence`, baseUrl),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.uploadToken.trim()}`,
      },
      body: form,
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      payload?.error || "OWC evidence upload service is temporarily unavailable.",
    );
  }

  const payload = (await response.json()) as {
    claimReference?: string;
    fileName?: string;
    status?: "Pending Review" | "Verified" | "Rejected";
    securityScan?: string;
  };

  if (!payload.claimReference || !payload.fileName || !payload.status) {
    throw new Error("OWC evidence upload returned an invalid response.");
  }

  return {
    claimReference: payload.claimReference,
    fileName: payload.fileName,
    status: payload.status,
    securityScan: payload.securityScan,
    source: "owc-api",
  };
}
