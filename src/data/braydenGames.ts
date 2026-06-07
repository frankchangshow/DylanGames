import type { Game } from "./types";

const braydenGames: Game[] = [
  {
    id: "coming-soon",
    title: "Brayden Games",
    description: "Coming soon.",
    type: "placeholder",
    playUrl: "",
    thumbnailUrl: null
  }
];

export async function getBraydenGames() {
  return braydenGames;
}

export async function getBraydenGame(gameId: string) {
  return braydenGames.find((game) => game.id === gameId) || null;
}
