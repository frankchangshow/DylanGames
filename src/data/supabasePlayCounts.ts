type SupabasePlayCountRow = {
  kid: string;
  game_id: string;
  play_count: number;
};

function getRestUrl(url: string) {
  const trimmedUrl = url.replace(/\/$/, "");
  return trimmedUrl.endsWith("/rest/v1") ? trimmedUrl : `${trimmedUrl}/rest/v1`;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return {
    restUrl: getRestUrl(url),
    serviceKey
  };
}

export function getSupabasePlayCountStatus() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let urlHost: string | null = null;
  let restPath: string | null = null;

  try {
    if (url) {
      const restUrl = new URL(getRestUrl(url));
      urlHost = restUrl.host;
      restPath = restUrl.pathname;
    }
  } catch {
    urlHost = "invalid-url";
  }

  return {
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(serviceKey),
    urlHost,
    restPath
  };
}

function getHeaders(serviceKey: string) {
  return {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json"
  };
}

export function isSupabasePlayCountsConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function fetchPlayCounts() {
  const config = getSupabaseConfig();

  if (!config) {
    return {};
  }

  const response = await fetch(`${config.restUrl}/game_play_counts?select=kid,game_id,play_count`, {
    headers: getHeaders(config.serviceKey),
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Could not load play counts: ${response.status} ${message}`);
  }

  const rows = (await response.json()) as SupabasePlayCountRow[];

  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[`${row.kid}:${row.game_id}`] = Number(row.play_count) || 0;
    return counts;
  }, {});
}

export async function incrementPlayCount(kid: string, gameId: string) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.restUrl}/rpc/increment_play_count`, {
    method: "POST",
    headers: getHeaders(config.serviceKey),
    body: JSON.stringify({
      target_kid: kid,
      target_game_id: gameId
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Could not increment play count: ${response.status} ${message}`);
  }

  return Number(await response.json()) || 0;
}
