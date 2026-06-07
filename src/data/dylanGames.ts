import { discoverGames } from "./discoverGames";
import type { Game } from "./types";

const reactGames: Game[] = [
  {
    id: "blox_figther_2d",
    title: "Blox Fighter 2D",
    description: "A React fighting adventure.",
    type: "react",
    playUrl: "",
    thumbnailUrl: null
  },
  {
    id: "may_plane_update",
    title: "May Plane Update",
    description: "A React flying game.",
    type: "react",
    playUrl: "",
    thumbnailUrl: null
  }
];

export async function getDylanGames() {
  const htmlGames = await discoverGames("dylan");
  return [...reactGames, ...htmlGames].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDylanGame(gameId: string) {
  const games = await getDylanGames();
  return games.find((game) => game.id === gameId) || null;
}
