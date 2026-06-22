import { NextResponse } from "next/server";
import {
  fetchPlayCounts,
  getSupabasePlayCountStatus,
  incrementPlayCount,
  isSupabasePlayCountsConfigured
} from "@/src/data/supabasePlayCounts";
import { isKid } from "@/src/data/games";

export const dynamic = "force-dynamic";

function isSafeGameId(value: string) {
  return /^[a-zA-Z0-9_-]{1,80}$/.test(value);
}

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";
  const status = getSupabasePlayCountStatus();

  if (!isSupabasePlayCountsConfigured()) {
    return NextResponse.json({ counts: {}, configured: false, ...(debug ? { status } : {}) });
  }

  try {
    const counts = await fetchPlayCounts();
    return NextResponse.json({ counts, configured: true, ...(debug ? { status } : {}) });
  } catch (error) {
    return NextResponse.json(
      {
        counts: {},
        configured: true,
        ...(debug
          ? {
              status,
              error: error instanceof Error ? error.message : "Unknown Supabase error"
            }
          : {})
      },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { kid?: unknown; gameId?: unknown } | null;
  const kid = body?.kid;
  const gameId = body?.gameId;

  if (typeof kid !== "string" || typeof gameId !== "string" || !isKid(kid) || !isSafeGameId(gameId)) {
    return NextResponse.json({ error: "Invalid game" }, { status: 400 });
  }

  if (!isSupabasePlayCountsConfigured()) {
    return NextResponse.json({ count: 0, configured: false });
  }

  try {
    const count = await incrementPlayCount(kid, gameId);
    return NextResponse.json({ count, configured: true });
  } catch {
    return NextResponse.json({ error: "Could not update play count" }, { status: 502 });
  }
}
