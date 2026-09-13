import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";
import type { ClaimStatus, ClaimTrackResponse } from "@/lib/api/contracts";

type UpstreamClaim = Omit<ClaimTrackResponse, "status"> & { status: string };
type UpstreamTrackResponse = {
  found: boolean;
  claim?: UpstreamClaim;
};

function normalizeStatus(status: string): ClaimStatus {
  switch (status.trim().toLowerCase()) {
    case "new":
    case "received":
      return "Received";
    case "under assessment":
      return "Under Assessment";
    case "awaiting documents":
      return "Awaiting Documents";
    case "approved":
      return "Approved";
    case "paid":
      return "Paid";
    case "declined":
      return "Declined";
    default:
      return "Under Assessment";
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { reference?: unknown; surname?: unknown } | null;
  const reference = typeof body?.reference === "string" ? body.reference.trim() : "";
  const surname = typeof body?.surname === "string" ? body.surname.trim() : undefined;

  if (reference.length < 4 || reference.length > 40) {
    return NextResponse.json({ error: "Enter a valid claim reference." }, { status: 400 });
  }

  try {
    const upstream = await owcRequest<UpstreamTrackResponse>("/api/claims/track", {
      method: "POST",
      body: JSON.stringify({ reference, ...(surname ? { surname } : {}) }),
    });

    if (!upstream.found || !upstream.claim) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    const claim: ClaimTrackResponse = {
      ...upstream.claim,
      status: normalizeStatus(upstream.claim.status),
    };
    return NextResponse.json({ found: true, claim });
  } catch (error) {
    if (error instanceof OwcApiError) {
      const status = error.status === 404 ? 404 : error.status >= 500 ? 503 : error.status;
      return NextResponse.json(
        { error: status === 503 ? "OWC claim service is temporarily unavailable." : error.message },
        { status },
      );
    }
    return NextResponse.json({ error: "OWC claim service is temporarily unavailable." }, { status: 503 });
  }
}
