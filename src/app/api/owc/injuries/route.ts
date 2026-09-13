import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";

type InjuryInput = {
  employerName?: unknown;
  employerContact?: unknown;
  workerName?: unknown;
  injuryDate?: unknown;
  injuryType?: unknown;
  description?: unknown;
};

type UpstreamInjuryResponse = {
  ok?: boolean;
  reference?: string;
  error?: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as InjuryInput | null;
  const employerName = typeof body?.employerName === "string" ? body.employerName.trim() : "";
  const workerName = typeof body?.workerName === "string" ? body.workerName.trim() : "";
  const injuryDate = typeof body?.injuryDate === "string" ? body.injuryDate.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (employerName.length < 2 || workerName.length < 2 || injuryDate.length < 4 || description.length < 5) {
    return NextResponse.json({ error: "Please complete all required injury-report fields." }, { status: 400 });
  }

  try {
    const upstream = await owcRequest<UpstreamInjuryResponse>("/api/injuries", {
      method: "POST",
      body: JSON.stringify({
        employerName,
        employerContact: typeof body?.employerContact === "string" ? body.employerContact.trim() : undefined,
        workerName,
        injuryDate,
        injuryType: typeof body?.injuryType === "string" ? body.injuryType.trim() : undefined,
        description,
      }),
    });

    if (!upstream.reference) {
      return NextResponse.json({ error: upstream.error || "OWC did not return an injury reference." }, { status: 502 });
    }
    return NextResponse.json({ reference: upstream.reference }, { status: 201 });
  } catch (error) {
    if (error instanceof OwcApiError) {
      return NextResponse.json(
        { error: error.status >= 500 ? "OWC injury reporting service is temporarily unavailable." : error.message },
        { status: error.status >= 500 ? 503 : error.status },
      );
    }
    return NextResponse.json({ error: "OWC injury reporting service is temporarily unavailable." }, { status: 503 });
  }
}
