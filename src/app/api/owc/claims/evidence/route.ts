import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";

const CATEGORIES = new Set([
  "Identity",
  "Medical",
  "Employment",
  "Employer",
  "Incident",
  "Banking",
  "Correspondence",
  "Other",
]);

type EvidenceUploadResponse = {
  claimReference: string;
  title: string;
  category: string;
  fileName: string;
  sizeBytes?: number;
  sha256?: string;
  status: string;
  securityScan?: string;
};

export async function POST(request: Request) {
  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid evidence upload request." }, { status: 400 });
  }

  const reference = String(incoming.get("reference") ?? "").trim().toUpperCase();
  const token = String(incoming.get("token") ?? "").trim();
  const title = String(incoming.get("title") ?? "").trim();
  const category = String(incoming.get("category") ?? "Other").trim();
  const file = incoming.get("file");

  if (!reference || !token || !title || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Claim reference, upload authorization, title and evidence file are required." },
      { status: 400 },
    );
  }
  if (!CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid evidence category." }, { status: 400 });
  }

  const outbound = new FormData();
  outbound.set("title", title);
  outbound.set("category", category);
  outbound.set("file", file, file.name);

  try {
    const result = await owcRequest<EvidenceUploadResponse>(
      `/api/claims/${encodeURIComponent(reference)}/evidence`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: outbound,
        timeoutMs: 30000,
      },
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof OwcApiError) {
      const status = error.status >= 500 ? 503 : error.status;
      return NextResponse.json(
        {
          error:
            error.status >= 500
              ? "OWC evidence upload service is temporarily unavailable."
              : error.message,
        },
        { status },
      );
    }
    return NextResponse.json(
      { error: "OWC evidence upload service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
