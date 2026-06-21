type SupabasePlayCountRow = {
  kid: string;
  game_id: string;
  play_count: number;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1`,
    serviceKey
  };
}

export function getSupabasePlayCountStatus() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let urlHost: string | null = null;

  try {
    urlHost = url ? new URL(url).host : null;
  } catch {
    urlHost = "invalid-url";
  }

  return {
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(serviceKey),
    urlHost
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
