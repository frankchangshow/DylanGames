"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Kid } from "@/src/data/types";
import { playCountKey, playCountsChangedEvent, playCountsStorageKey } from "./playCounts";

type GameCardStatsProps = {
  kid: Kid;
  gameId: string;
  gameIds: string[];
  isNew: boolean;
  variant: "brayden" | "dylan";
};

function formatPlayCount(count: number) {
  return count === 1 ? "1 play" : `${count} plays`;
}

export default function GameCardStats({ kid, gameId, gameIds, isNew, variant }: GameCardStatsProps) {
  const countsSnapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(playCountsChangedEvent, onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(playCountsChangedEvent, onStoreChange);
      };
    },
    () => window.localStorage.getItem(playCountsStorageKey) || "{}",
    () => "{}"
  );

  const counts = useMemo(() => {
    try {
      return JSON.parse(countsSnapshot) as Record<string, number>;
    } catch {
      return {};
    }
  }, [countsSnapshot]);

  const { count, isPopular } = useMemo(() => {
    const keyedCounts = gameIds.map((id) => counts[playCountKey(kid, id)] || 0);
    const highestCount = Math.max(0, ...keyedCounts);
    const currentCount = counts[playCountKey(kid, gameId)] || 0;

    return {
      count: currentCount,
      isPopular: highestCount > 0 && currentCount === highestCount
    };
  }, [counts, gameId, gameIds, kid]);

  return (
    <>
      <span className={`${variant}PlayCount`}>{formatPlayCount(count)}</span>
      <span className={`${variant}Badges`} aria-label="Game badges">
        {isNew ? <span className={`${variant}Badge ${variant}NewBadge`}>New</span> : null}
        {isPopular ? <span className={`${variant}Badge ${variant}PopularBadge`}>Popular</span> : null}
      </span>
    </>
  );
}
