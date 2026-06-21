import { NextResponse } from "next/server";
import { fetchPlayCounts, incrementPlayCount, isSupabasePlayCountsConfigured } from "@/src/data/supabasePlayCounts";
import { getGameForKid, isKid } from "@/src/data/games";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabasePlayCountsConfigured()) {
    return NextResponse.json({ counts: {}, configured: false });
  }

  try {
    const counts = await fetchPlayCounts();
    return NextResponse.json({ counts, configured: true });
  } catch {
    return NextResponse.json({ counts: {}, configured: true }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { kid?: unknown; gameId?: unknown } | null;
  const kid = body?.kid;
  const gameId = body?.gameId;

  if (typeof kid !== "string" || typeof gameId !== "string" || !isKid(kid)) {
    return NextResponse.json({ error: "Invalid game" }, { status: 400 });
  }

  const game = await getGameForKid(kid, gameId);

  if (!game || game.status === "coming-soon" || game.type === "placeholder") {
    return NextResponse.json({ error: "Invalid game" }, { status: 404 });
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
