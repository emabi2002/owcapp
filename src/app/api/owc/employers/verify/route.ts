import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";
import type { EmployerVerifyResponse } from "@/lib/api/contracts";

type UpstreamEmployerResponse = {
  ok?: boolean;
  result?: {
    registered?: boolean;
    name?: string;
    registrationNo?: string;
    policyExpiry?: string;
    status?: string;
  };
  error?: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { query?: unknown } | null;
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (query.length < 2 || query.length > 160) {
    return NextResponse.json({ error: "Enter an employer name or registration number." }, { status: 400 });
  }

  try {
    const upstream = await owcRequest<UpstreamEmployerResponse>("/api/employers/verify", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    if (!upstream.result) {
      return NextResponse.json({ error: upstream.error || "Employer verification returned no result." }, { status: 502 });
    }
    const result: EmployerVerifyResponse = {
      registered: Boolean(upstream.result.registered),
      registrationNumber: upstream.result.registrationNo,
      employerName: upstream.result.name,
      status: upstream.result.status,
    };
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OwcApiError) {
      return NextResponse.json(
        { error: error.status >= 500 ? "OWC employer service is temporarily unavailable." : error.message },
        { status: error.status >= 500 ? 503 : error.status },
      );
    }
    return NextResponse.json({ error: "OWC employer service is temporarily unavailable." }, { status: 503 });
  }
}
