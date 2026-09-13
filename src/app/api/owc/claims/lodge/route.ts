import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";
import type { ClaimLodgeRequest, ClaimLodgeResponse } from "@/lib/api/contracts";

type UpstreamLodgeResponse = {
  ok?: boolean;
  reference?: string;
  evidenceUploadToken?: string;
  evidenceUploadExpiresInSeconds?: number;
  error?: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Partial<ClaimLodgeRequest> | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const employer = typeof body?.employer === "string" ? body.employer.trim() : "";
  const injuryDate = typeof body?.injuryDate === "string" ? body.injuryDate.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (name.length < 2 || phone.length < 3 || employer.length < 2 || injuryDate.length < 4 || description.length < 5) {
    return NextResponse.json({ error: "Please complete all required claim fields." }, { status: 400 });
  }

  try {
    const upstream = await owcRequest<UpstreamLodgeResponse>("/api/claims/lodge", {
      method: "POST",
      body: JSON.stringify({
        workerName: name,
        workerPhone: phone,
        workerEmail: body?.email || "",
        employerName: employer,
        province: body?.province || undefined,
        occupation: body?.occupation || undefined,
        weeklyWage: body?.wage || undefined,
        injuryDate,
        injuryType: body?.injuryType || undefined,
        description,
        documentCount: 0,
        declaration: true,
      }),
    });

    if (!upstream.reference) {
      return NextResponse.json({ error: upstream.error || "OWC did not return a claim reference." }, { status: 502 });
    }

    const response: ClaimLodgeResponse = {
      reference: upstream.reference,
      status: "Received",
      message: "Claim received by OWC.",
      evidenceUploadToken: upstream.evidenceUploadToken,
      evidenceUploadExpiresInSeconds: upstream.evidenceUploadExpiresInSeconds,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof OwcApiError) {
      return NextResponse.json(
        { error: error.status >= 500 ? "OWC claim lodgement service is temporarily unavailable." : error.message },
        { status: error.status >= 500 ? 503 : error.status },
      );
    }
    return NextResponse.json({ error: "OWC claim lodgement service is temporarily unavailable." }, { status: 503 });
  }
}
