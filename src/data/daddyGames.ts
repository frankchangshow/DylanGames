import { discoverGames } from "./discoverGames";
import type { Game } from "./types";

const placeholderGames: Game[] = [
  {
    id: "first-fight",
    title: "First Fight",
    description: "The first Daddy game will enter the arena soon.",
    type: "placeholder",
    status: "coming-soon",
    playUrl: "",
    thumbnailUrl: null
  }
];

export async function getDaddyGames() {
  const discoveredGames = await discoverGames("daddy");
  return discoveredGames.length > 0 ? discoveredGames : placeholderGames;
}

export async function getDaddyGame(gameId: string) {
  const games = await getDaddyGames();
  return games.find((game) => game.id === gameId) || null;
}
