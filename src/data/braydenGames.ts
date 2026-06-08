import type { Game } from "./types";

const braydenGames: Game[] = [
  {
    id: "water-chess",
    title: "Water Chess",
    description: "A chess battle with powers and elements.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/water-chess/index.html",
    thumbnailUrl: null
  },
  {
    id: "laser-tag",
    title: "Laser Tag",
    description: "A fast laser battle game with powers.",
    type: "html",
    status: "coming-soon",
    playUrl: "/games/brayden/laser-tag/index.html",
    thumbnailUrl: null
  },
  {
    id: "metropolis_street_racer",
    title: "Metropolis Street Racer",
    description: "Race through the city with speed boosts and power boxes.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/metropolis_street_racer/metropolis_street_racer.html",
    thumbnailUrl: null
  }
];

export async function getBraydenGames() {
  return braydenGames;
}

export async function getBraydenGame(gameId: string) {
  return braydenGames.find((game) => game.id === gameId) || null;
}
