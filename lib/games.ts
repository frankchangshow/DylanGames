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

function titleFromName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isGameType(value: unknown): value is GameType {
  return value === "html" || value === "scratch" || value === "external";
}

function firstExistingThumbnail(folderPath: string, gameId: string, config?: GameJson | null) {
  if (config?.thumbnail) {
    return config.thumbnail.startsWith("/") ? config.thumbnail : `/games/${gameId}/${config.thumbnail}`;
  }

  const thumbnailName = thumbnailNames.find((name) => existsSync(path.join(folderPath, name)));
  return thumbnailName ? `/games/${gameId}/${thumbnailName}` : null;
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

async function findHtmlFile(folderPath: string) {
  const entries = await readdir(folderPath, { withFileTypes: true });
  const htmlFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
    .map((entry) => entry.name)
    .sort((a, b) => {
      if (a === "index.html") return -1;
      if (b === "index.html") return 1;
      return a.localeCompare(b);
    });

  return htmlFiles[0] || null;
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

        if (type === "scratch" || type === "external") {
          if (!config?.url) {
            return null;
          }

          return {
            id,
            title: config.title?.trim() || titleFromName(id),
            type,
            playUrl: config.url,
            thumbnailUrl: firstExistingThumbnail(folderPath, id, config)
          };
        }

        const htmlFile = await findHtmlFile(folderPath);

        if (!htmlFile) {
          return null;
        }

        return {
          id,
          title: config?.title?.trim() || titleFromName(id),
          type: "html",
          playUrl: `/games/${id}/${htmlFile}`,
          thumbnailUrl: firstExistingThumbnail(folderPath, id, config)
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
