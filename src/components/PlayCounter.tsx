"use client";

import { useEffect } from "react";
import type { Kid } from "@/src/data/types";
import { incrementSharedPlayCount } from "./playCounts";

type PlayCounterProps = {
  kid: Kid;
  gameId: string;
};

export default function PlayCounter({ kid, gameId }: PlayCounterProps) {
  useEffect(() => {
    void incrementSharedPlayCount(kid, gameId);
  }, [gameId, kid]);

  return null;
}
