import { NextResponse } from "next/server";
import { OwcApiError, owcRequest } from "@/lib/api/client";
import type { NewsItem } from "@/lib/api/contracts";

type UpstreamNews = { items?: NewsItem[] };

export async function GET() {
  try {
    const upstream = await owcRequest<UpstreamNews>("/api/public/news");
    return NextResponse.json({ items: Array.isArray(upstream.items) ? upstream.items : [] });
  } catch (error) {
    if (error instanceof OwcApiError) {
      return NextResponse.json({ error: "OWC news service is temporarily unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: "OWC news service is temporarily unavailable." }, { status: 503 });
  }
}
