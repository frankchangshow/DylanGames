import { getBraydenGame, getBraydenGames } from "./braydenGames";
import { getDaddyGame, getDaddyGames } from "./daddyGames";
import { getDylanGame, getDylanGames } from "./dylanGames";
import type { Game, Kid } from "./types";

export function isKid(value: string): value is Kid {
  return value === "dylan" || value === "brayden" || value === "daddy";
}

export async function getGamesForKid(kid: Kid): Promise<Game[]> {
  if (kid === "dylan") {
    return getDylanGames();
  }

  return kid === "brayden" ? getBraydenGames() : getDaddyGames();
}

export async function getGameForKid(kid: Kid, gameId: string) {
  if (kid === "dylan") {
    return getDylanGame(gameId);
  }

  return kid === "brayden" ? getBraydenGame(gameId) : getDaddyGame(gameId);
}

export async function getPlayableGames() {
  const [dylanGames, braydenGames, daddyGames] = await Promise.all([
    getDylanGames(),
    getBraydenGames(),
    getDaddyGames()
  ]);

  return [
    ...dylanGames.map((game) => ({ kid: "dylan" as const, game })),
    ...braydenGames.map((game) => ({ kid: "brayden" as const, game })),
    ...daddyGames.map((game) => ({ kid: "daddy" as const, game }))
  ].filter(({ game }) => game.type !== "external" && game.type !== "placeholder");
}
