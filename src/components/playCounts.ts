import type { Kid } from "@/src/data/types";

export const playCountsChangedEvent = "chang-family-games:play-counts-changed";

let countsSnapshot = "{}";
let hasLoadedCounts = false;
const listeners = new Set<() => void>();

export function playCountKey(kid: Kid, gameId: string) {
  return `${kid}:${gameId}`;
}

function setCounts(counts: Record<string, number>) {
  countsSnapshot = JSON.stringify(counts);
  hasLoadedCounts = true;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event(playCountsChangedEvent));
}

function getCountsFromSnapshot() {
  try {
    return JSON.parse(countsSnapshot) as Record<string, number>;
  } catch {
    return {};
  }
}

export function subscribeToPlayCounts(listener: () => void) {
  listeners.add(listener);

  if (!hasLoadedCounts) {
    void refreshPlayCounts();
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getPlayCountsSnapshot() {
  return countsSnapshot;
}

export function getEmptyPlayCountsSnapshot() {
  return "{}";
}

export async function refreshPlayCounts() {
  try {
    const response = await fetch("/api/play-counts", {
      cache: "no-store"
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { counts?: Record<string, number> };
    setCounts(data.counts || {});
  } catch {
    setCounts({});
  }
}

export async function incrementSharedPlayCount(kid: Kid, gameId: string) {
  try {
    const response = await fetch("/api/play-counts", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ kid, gameId }),
      cache: "no-store"
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { count?: number };
    const counts = getCountsFromSnapshot();
    counts[playCountKey(kid, gameId)] = data.count || 0;
    setCounts(counts);
  } catch {
    // Counts should never block a game from loading.
  }
}
