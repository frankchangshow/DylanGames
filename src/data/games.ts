import { getBraydenGame, getBraydenGames } from "./braydenGames";
import { getDylanGame, getDylanGames } from "./dylanGames";
import type { Game, Kid } from "./types";

export function isKid(value: string): value is Kid {
  return value === "dylan" || value === "brayden";
}

export async function getGamesForKid(kid: Kid): Promise<Game[]> {
  return kid === "dylan" ? getDylanGames() : getBraydenGames();
}

export async function getGameForKid(kid: Kid, gameId: string) {
  return kid === "dylan" ? getDylanGame(gameId) : getBraydenGame(gameId);
}

export async function getPlayableGames() {
  const [dylanGames, braydenGames] = await Promise.all([getDylanGames(), getBraydenGames()]);

  return [
    ...dylanGames.map((game) => ({ kid: "dylan" as const, game })),
    ...braydenGames.map((game) => ({ kid: "brayden" as const, game }))
  ].filter(({ game }) => game.type !== "external" && game.type !== "placeholder");
}
