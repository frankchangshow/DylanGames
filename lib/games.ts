import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import path from "path";

export type GameType = "html" | "scratch" | "external";

export type Game = {
  id: string;
  title: string;
  type: GameType;
  playUrl: string;
  thumbnailUrl: string | null;
};

type GameJson = {
  title?: string;
  type?: GameType;
  url?: string;
  thumbnail?: string;
};

const gamesDirectory = path.join(process.cwd(), "public", "games");
const thumbnailNames = ["thumbnail.png", "thumbnail.jpg", "thumbnail.jpeg", "thumbnail.webp", "thumbnail.gif"];

function titleFromFolderName(folderName: string) {
  return folderName
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function firstExistingThumbnail(folderPath: string, gameId: string) {
  const thumbnailName = thumbnailNames.find((name) => existsSync(path.join(folderPath, name)));
  return thumbnailName ? `/games/${gameId}/${thumbnailName}` : null;
}

function isGameType(value: unknown): value is GameType {
  return value === "html" || value === "scratch" || value === "external";
}

async function readGameJson(folderPath: string): Promise<GameJson | null> {
  const jsonPath = path.join(folderPath, "game.json");

  if (!existsSync(jsonPath)) {
    return null;
  }

  try {
    return JSON.parse(await readFile(jsonPath, "utf8")) as GameJson;
  } catch {
    return null;
  }
}

export async function getGames(): Promise<Game[]> {
  if (!existsSync(gamesDirectory)) {
    return [];
  }

  const entries = await readdir(gamesDirectory, { withFileTypes: true });
  const games = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const id = entry.name;
        const folderPath = path.join(gamesDirectory, id);
        const config = await readGameJson(folderPath);
        const type = isGameType(config?.type) ? config.type : "html";
        const htmlPath = path.join(folderPath, "index.html");

        if (type === "html" && !existsSync(htmlPath)) {
          return null;
        }

        if ((type === "scratch" || type === "external") && !config?.url) {
          return null;
        }

        return {
          id,
          title: config?.title?.trim() || titleFromFolderName(id),
          type,
          playUrl: config?.url || `/games/${id}/index.html`,
          thumbnailUrl: config?.thumbnail || firstExistingThumbnail(folderPath, id)
        };
      })
  );

  return games
    .filter((game): game is Game => Boolean(game))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getGame(gameId: string) {
  const games = await getGames();
  return games.find((game) => game.id === gameId) || null;
}
