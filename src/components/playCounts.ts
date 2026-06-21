import type { Kid } from "@/src/data/types";

export const playCountsStorageKey = "chang-brother-games:play-counts";
export const playCountsChangedEvent = "chang-brother-games:play-counts-changed";

export function playCountKey(kid: Kid, gameId: string) {
  return `${kid}:${gameId}`;
}

export function readPlayCounts() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const value = window.localStorage.getItem(playCountsStorageKey);
    return value ? (JSON.parse(value) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function writePlayCounts(counts: Record<string, number>) {
  window.localStorage.setItem(playCountsStorageKey, JSON.stringify(counts));
  window.dispatchEvent(new Event(playCountsChangedEvent));
}
