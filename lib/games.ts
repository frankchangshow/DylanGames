export type GameType = "html" | "scratch" | "external";

export type Game = {
  id: string;
  title: string;
  type: GameType;
  playUrl: string;
  thumbnailUrl: string | null;
};

const hardcodedGames = [
  {
    title: "Stop Then Go",
    type: "html",
    url: "/games/stop-then-go/index.html"
  },
  {
    title: "Pikachu Battle",
    type: "html",
    url: "/games/pikachu-battle/index.html"
  }
] as const;

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugForGame(title: string, url: string) {
  const parts = url.split("/").filter(Boolean);
  const gamesIndex = parts.indexOf("games");
  return gamesIndex >= 0 && parts[gamesIndex + 1] ? parts[gamesIndex + 1] : slugFromTitle(title);
}

export function getGames(): Game[] {
  return hardcodedGames.map((game) => ({
    id: slugForGame(game.title, game.url),
    title: game.title,
    type: game.type,
    playUrl: game.url,
    thumbnailUrl: null
  }));
}

export function getGame(gameId: string) {
  return getGames().find((game) => game.id === gameId) || null;
}
