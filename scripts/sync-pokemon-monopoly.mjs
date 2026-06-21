import { cp, mkdir, rm, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { spawnSync } from "child_process";

const repoRoot = process.cwd();
const localSource =
  process.env.POKEMON_MONOPOLY_SOURCE ||
  "/Users/frank.chang/Documents/Antigravity_Project/Pokemon_Monopoly";
const remoteRepo = "https://github.com/frankchangshow/pokemon_monopoly.git";
const target = path.join(repoRoot, "public", "games", "daddy", "pokemon-monopoly");
const tempSource = path.join(tmpdir(), `pokemon-monopoly-${Date.now()}`);

const ignoredNames = new Set([
  ".git",
  ".github",
  ".DS_Store",
  ".gitignore",
  "PokemonBattleEngine",
  "logs",
  "output",
  "progress.md",
  "server.py"
]);

async function copySource(sourcePath) {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(sourcePath, target, {
    recursive: true,
    filter: (source) => !ignoredNames.has(path.basename(source))
  });
}

function cloneRemote() {
  const result = spawnSync("git", ["clone", "--depth", "1", remoteRepo, tempSource], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`Could not clone ${remoteRepo}`);
  }
}

async function writeLauncherFiles() {
  const gameJson = {
    title: "Pokemon Monopoly",
    description: "A board game adventure with battles, properties, and big comeback moments.",
    type: "html",
    thumbnail: "thumbnail.png"
  };

  await writeFile(path.join(target, "game.json"), `${JSON.stringify(gameJson, null, 2)}\n`);

  const logoPath = path.join(target, "images", "logo.png");
  if (existsSync(logoPath)) {
    await cp(logoPath, path.join(target, "thumbnail.png"));
  }
}

const source = existsSync(path.join(localSource, "index.html")) ? localSource : tempSource;

try {
  if (source === tempSource) {
    cloneRemote();
  }

  await copySource(source);
  await writeLauncherFiles();

  console.log(`Synced Pokemon Monopoly into ${path.relative(repoRoot, target)}`);
} finally {
  await rm(tempSource, { recursive: true, force: true });
}
