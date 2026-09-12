import { SAMPLE_CLAIMS, type ClaimRecord } from "@/lib/owc-data";

const DEFAULT_OWC_API_BASE_URL = process.env.NEXT_PUBLIC_OWC_API_BASE_URL?.trim() ?? "";

type FetchLike = typeof fetch;

export type TrackClaimInput = {
  reference: string;
  surname?: string;
};

export type TrackClaimResult = {
  found: boolean;
  claim: ClaimRecord | null;
  source: "owc-api" | "mock";
};

export type TrackClaimOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

export function isOwcApiConfigured(baseUrl = DEFAULT_OWC_API_BASE_URL) {
  return baseUrl.trim().length > 0;
}

export function buildOwcApiUrl(
  path: string,
  baseUrl = DEFAULT_OWC_API_BASE_URL,
) {
  const normalizedBase = baseUrl.trim().replace(/\/+$/, "");
  const normalizedPath = `/${path.trim().replace(/^\/+/, "")}`;

  if (!normalizedBase) return normalizedPath;
  return `${normalizedBase}${normalizedPath}`;
}

function normalizeClaimStatus(value: string): ClaimRecord["status"] {
  switch (value.trim().toLowerCase()) {
    case "new":
    case "received":
      return "Received";
    case "under assessment":
    case "assessment":
      return "Under Assessment";
    case "awaiting documents":
    case "documents required":
      return "Awaiting Documents";
    case "approved":
      return "Approved";
    case "paid":
      return "Paid";
    case "declined":
    case "rejected":
      return "Declined";
    default:
      return "Under Assessment";
  }
}

function normalizeApiClaim(value: Record<string, unknown>): ClaimRecord {
  const steps = Array.isArray(value.steps)
    ? value.steps.map((step) => {
        const item = step as Record<string, unknown>;
        return {
          label: String(item.label ?? "Processing step"),
          done: Boolean(item.done),
          ...(item.date ? { date: String(item.date) } : {}),
          ...(item.note ? { note: String(item.note) } : {}),
        };
      })
    : [];

  return {
    reference: String(value.reference ?? "").toUpperCase(),
    worker: String(value.worker ?? "—"),
    employer: String(value.employer ?? "—"),
    injuryDate: String(value.injuryDate ?? value.injury_date ?? "—"),
    lodged: String(value.lodged ?? value.receivedAt ?? value.received_at ?? "—"),
    type: String(value.type ?? value.injuryType ?? value.injury_type ?? "Workplace injury"),
    status: normalizeClaimStatus(String(value.status ?? "Under Assessment")),
    steps,
    pending: Array.isArray(value.pending) ? value.pending.map(String) : undefined,
    updates: Array.isArray(value.updates)
      ? value.updates.map((update) => {
          const item = update as Record<string, unknown>;
          return {
            date: String(item.date ?? ""),
            text: String(item.text ?? item.message ?? "Claim updated"),
          };
        })
      : undefined,
  };
}

function getMockClaim(reference: string): ClaimRecord | null {
  const normalizedReference = reference.trim().toUpperCase();
  const existing = SAMPLE_CLAIMS.find(
    (claim) => claim.reference.toUpperCase() === normalizedReference,
  );
  if (existing) return existing;

  if (!normalizedReference.startsWith("OWC-")) return null;

  return {
    ...SAMPLE_CLAIMS[0],
    reference: normalizedReference,
    status: "Received",
    steps: [
      { label: "Claim received", done: true, date: "Today" },
      { label: "Documents verified", done: false },
      { label: "Medical assessment", done: false },
      { label: "Determination", done: false },
      { label: "Compensation payment", done: false },
    ],
    pending: ["Medical Practitioner's First Report (MED-1)"],
    updates: [{ date: "Today", text: "Claim received and queued for verification." }],
  };
}

export async function trackClaim(
  input: TrackClaimInput,
  options: TrackClaimOptions = {},
): Promise<TrackClaimResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_OWC_API_BASE_URL;

  if (!isOwcApiConfigured(baseUrl)) {
    const claim = getMockClaim(input.reference);
    return { found: Boolean(claim), claim, source: "mock" };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(buildOwcApiUrl("/api/claims/track", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reference: input.reference.trim(),
      ...(input.surname?.trim() ? { surname: input.surname.trim() } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error("OWC claim tracking service is temporarily unavailable.");
  }

  const payload = (await response.json()) as {
    found?: boolean;
    claim?: Record<string, unknown>;
  };

  if (!payload.found || !payload.claim) {
    return { found: false, claim: null, source: "owc-api" };
  }

  return {
    found: true,
    claim: normalizeApiClaim(payload.claim),
    source: "owc-api",
  };
}
