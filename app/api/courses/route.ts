import { NextResponse } from "next/server";
import { getCachedCourses } from "@/lib/bff/cache";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getCachedCourses();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json([], { status: 500 }); }
}
