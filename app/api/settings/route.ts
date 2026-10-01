import { NextResponse } from "next/server";
import { getCachedSiteSettings } from "@/lib/bff/cache";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getCachedSiteSettings();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json(null, { status: 500 }); }
}
