import { SAMPLE_CLAIMS, type ClaimRecord } from "@/lib/owc-data";

const DEFAULT_OWC_API_BASE_URL = process.env.NEXT_PUBLIC_OWC_API_BASE_URL?.trim() ?? "";

type FetchLike = typeof fetch;

type ApiOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

export type TrackClaimInput = {
  reference: string;
  surname?: string;
};

export type TrackClaimResult = {
  found: boolean;
  claim: ClaimRecord | null;
  source: "owc-api" | "mock";
};

export type LodgeClaimInput = {
  workerName: string;
  workerPhone?: string;
  workerEmail?: string;
  employerName: string;
  province?: string;
  occupation?: string;
  weeklyWage?: string;
  injuryDate: string;
  injuryType?: string;
  description: string;
  documentCount?: number;
  declaration?: boolean;
  captchaToken?: string;
};

export type LodgeClaimResult = {
  reference: string;
  receivedAt?: string;
  source: "owc-api" | "mock";
};

export type EmployerVerifyResult = {
  registered: boolean;
  name?: string;
  registrationNo?: string;
  policyExpiry?: string;
  status?: string;
  source: "owc-api" | "mock";
};

export type InjuryReportInput = {
  employerName: string;
  employerContact?: string;
  workerName: string;
  injuryDate: string;
  injuryType?: string;
  description: string;
  captchaToken?: string;
};

export type InjuryReportResult = {
  reference: string;
  source: "owc-api" | "mock";
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

function newMockReference(prefix = "OWC") {
  return `${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function trackClaim(
  input: TrackClaimInput,
  options: ApiOptions = {},
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

export async function lodgeClaim(
  input: LodgeClaimInput,
  options: ApiOptions = {},
): Promise<LodgeClaimResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_OWC_API_BASE_URL;

  if (!isOwcApiConfigured(baseUrl)) {
    return {
      reference: newMockReference(),
      receivedAt: new Date().toISOString(),
      source: "mock",
    };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(buildOwcApiUrl("/api/claims/lodge", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("OWC claim lodgement service is temporarily unavailable.");
  }

  const payload = (await response.json()) as {
    reference?: string;
    receivedAt?: string;
  };
  if (!payload.reference) {
    throw new Error("OWC claim lodgement returned an invalid response.");
  }

  return {
    reference: payload.reference,
    receivedAt: payload.receivedAt,
    source: "owc-api",
  };
}

export async function verifyEmployer(
  input: { query: string },
  options: ApiOptions = {},
): Promise<EmployerVerifyResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_OWC_API_BASE_URL;

  if (!isOwcApiConfigured(baseUrl)) {
    const query = input.query.trim();
    const registered = query.length > 2;
    return {
      registered,
      ...(registered
        ? {
            name: query,
            registrationNo: "EMP-DEMO-1001",
            status: "Compliant",
          }
        : {}),
      source: "mock",
    };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(buildOwcApiUrl("/api/employers/verify", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: input.query.trim() }),
  });

  if (!response.ok) {
    throw new Error("OWC employer verification service is temporarily unavailable.");
  }

  const payload = (await response.json()) as Omit<EmployerVerifyResult, "source">;
  return { ...payload, source: "owc-api" };
}

export async function reportInjury(
  input: InjuryReportInput,
  options: ApiOptions = {},
): Promise<InjuryReportResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_OWC_API_BASE_URL;

  if (!isOwcApiConfigured(baseUrl)) {
    return { reference: newMockReference("INJ"), source: "mock" };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(buildOwcApiUrl("/api/injuries", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("OWC workplace injury reporting service is temporarily unavailable.");
  }

  const payload = (await response.json()) as { reference?: string };
  if (!payload.reference) {
    throw new Error("OWC workplace injury report returned an invalid response.");
  }

  return { reference: payload.reference, source: "owc-api" };
}
