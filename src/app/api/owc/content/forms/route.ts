import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";
import type { FormItem } from "@/lib/api/contracts";

type UpstreamForms = { items?: FormItem[] };

export async function GET() {
  try {
    const upstream = await owcRequest<UpstreamForms>("/api/public/forms");
    return NextResponse.json({ items: Array.isArray(upstream.items) ? upstream.items : [] });
  } catch (error) {
    if (error instanceof OwcApiError) {
      return NextResponse.json({ error: "OWC forms service is temporarily unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: "OWC forms service is temporarily unavailable." }, { status: 503 });
  }
}
