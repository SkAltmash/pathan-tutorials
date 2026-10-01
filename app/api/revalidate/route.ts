import { NextRequest, NextResponse } from "next/server";

// Caching is currently disabled — all data fetched fresh from Firestore.
// This endpoint is kept as a stub for future cache implementation.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  return NextResponse.json({ revalidated: false, tag, message: "Caching disabled — data is always fresh" });
}
