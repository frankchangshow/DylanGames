"use client";

import { useEffect } from "react";
import type { Kid } from "@/src/data/types";
import { playCountKey, readPlayCounts, writePlayCounts } from "./playCounts";

type PlayCounterProps = {
  kid: Kid;
  gameId: string;
};

export default function PlayCounter({ kid, gameId }: PlayCounterProps) {
  useEffect(() => {
    const counts = readPlayCounts();
    const key = playCountKey(kid, gameId);
    counts[key] = (counts[key] || 0) + 1;
    writePlayCounts(counts);
  }, [gameId, kid]);

  return null;
}
