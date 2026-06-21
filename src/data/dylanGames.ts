import { stat } from "fs/promises";
import path from "path";
import { discoverGames } from "./discoverGames";
import type { Game } from "./types";

const reactGames: Game[] = [
  {
    id: "blox_figther_2d",
    title: "Blox Fighter 2D",
    description: "A React fighting adventure.",
    type: "react",
    playUrl: "",
    thumbnailUrl: "/games/dylan/blox_figther_2d/thumbnail.png"
  },
  {
    id: "may_plane_update",
    title: "May Plane Update",
    description: "A React flying game.",
    type: "react",
    playUrl: "",
    thumbnailUrl: "/games/dylan/may_plane_update/thumbnail.png"
  }
];

async function addUploadedAt(game: Game) {
  try {
    const folderStats = await stat(path.join(process.cwd(), "public", "games", "dylan", game.id));
    return { ...game, uploadedAt: folderStats.mtimeMs };
  } catch {
    return game;
  }
}

export async function getDylanGames() {
  const [htmlGames, reactGamesWithDates] = await Promise.all([
    discoverGames("dylan"),
    Promise.all(reactGames.map(addUploadedAt))
  ]);

  return [...reactGamesWithDates, ...htmlGames].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDylanGame(gameId: string) {
  const games = await getDylanGames();
  return games.find((game) => game.id === gameId) || null;
}
