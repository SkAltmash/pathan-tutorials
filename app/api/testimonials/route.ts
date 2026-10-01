import { NextResponse } from "next/server";
import { getCachedTestimonials } from "@/lib/bff/cache";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getCachedTestimonials();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json([], { status: 500 }); }
}
