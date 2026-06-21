import { discoverGames } from "./discoverGames";
import type { Game } from "./types";

const braydenGameDetails: Array<Pick<Game, "id" | "title" | "description" | "type" | "status" | "playUrl">> = [
  {
    id: "2d_platformer",
    title: "2D Platformer",
    description: "Jump, collect coins, and unlock grapple powers.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/2d_platformer/2d_platformer.html"
  },
  {
    id: "ice_jump",
    title: "Ice Jump",
    description: "Leap across icy platforms and collect coins.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/ice_jump/ice_jump.html"
  },
  {
    id: "cavern_crawler",
    title: "Cavern Crawler",
    description: "Run through the cave and dodge the danger.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/cavern_crawler/cavern_crawler.html"
  },
  {
    id: "metropolis_street_racer",
    title: "Metropolis Street Racer",
    description: "Race through the city with speed boosts and power boxes.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/metropolis_street_racer/metropolis_street_racer.html"
  },
  {
    id: "pokemon_rhythm_jukebox",
    title: "Pokemon Rhythm Jukebox",
    description: "Battle to the beat with rhythm and arena moves.",
    type: "html",
    status: "playable",
    playUrl: "/games/brayden/pokemon_rhythm_jukebox/pokemon_rhythm_jukebox.html"
  }
];

export async function getBraydenGames() {
  const discoveredGames = await discoverGames("brayden");

  return discoveredGames
    .map((game) => {
      const details = braydenGameDetails.find((item) => item.id === game.id);

      return details ? { ...game, ...details, thumbnailUrl: game.thumbnailUrl } : game;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getBraydenGame(gameId: string) {
  const games = await getBraydenGames();
  return games.find((game) => game.id === gameId) || null;
}
