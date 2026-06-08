import type { Game } from "./types";

const braydenGames: Game[] = [
  {
    id: "2d_platformer",
    title: "2D Platformer",
    description: "Jump, collect coins, and unlock grapple powers.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/2d_platformer/2d_platformer.html",
    thumbnailUrl: null
  },
  {
    id: "ice_jump",
    title: "Ice Jump",
    description: "Leap across icy platforms and collect coins.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/ice_jump/ice_jump.html",
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
