import { discoverGames } from "./discoverGames";

export async function getDylanGames() {
  return discoverGames("dylan");
}

export async function getDylanGame(gameId: string) {
  const games = await getDylanGames();
  return games.find((game) => game.id === gameId) || null;
}
