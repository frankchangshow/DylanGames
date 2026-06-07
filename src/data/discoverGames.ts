import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import path from "path";
import type { Game, GameType, Kid } from "./types";

type GameJson = {
  title?: string;
  description?: string;
  type?: GameType;
  url?: string;
  thumbnail?: string;
};

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
  return value === "html" || value === "scratch" || value === "external" || value === "placeholder";
}

function getThumbnail(folderPath: string, kid: Kid, gameId: string, config?: GameJson | null) {
  if (config?.thumbnail) {
    return config.thumbnail.startsWith("/") ? config.thumbnail : `/games/${kid}/${gameId}/${config.thumbnail}`;
  }

  const thumbnailName = thumbnailNames.find((name) => existsSync(path.join(folderPath, name)));
  return thumbnailName ? `/games/${kid}/${gameId}/${thumbnailName}` : null;
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

export async function discoverGames(kid: Kid): Promise<Game[]> {
  const gamesDirectory = path.join(process.cwd(), "public", "games", kid);

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
        const title = config?.title?.trim() || titleFromName(id);

        if (type === "scratch" || type === "external") {
          if (!config?.url) {
            return null;
          }

          return {
            id,
            title,
            description: config.description?.trim() || "Ready to play.",
            type,
            playUrl: config.url,
            thumbnailUrl: getThumbnail(folderPath, kid, id, config)
          };
        }

        const htmlFile = await findHtmlFile(folderPath);

        if (!htmlFile) {
          return null;
        }

        return {
          id,
          title,
          description: config?.description?.trim() || "Jump in and play.",
          type: "html",
          playUrl: `/games/${kid}/${id}/${htmlFile}`,
          thumbnailUrl: getThumbnail(folderPath, kid, id, config)
        };
      })
  );

  return games
    .filter((game): game is Game => Boolean(game))
    .sort((a, b) => a.title.localeCompare(b.title));
}
