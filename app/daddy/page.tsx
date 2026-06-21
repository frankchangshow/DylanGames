import Link from "next/link";
import GameCardStats from "@/src/components/GameCardStats";
import { getDaddyGames } from "@/src/data/daddyGames";
import type { Game } from "@/src/data/types";

const gameTypeLabels: Record<Game["type"], string> = {
  external: "External",
  html: "HTML",
  nextjs: "Next.js",
  other: "Other",
  placeholder: "Soon",
  react: "React",
  scratch: "Scratch"
};

function DaddyThumbnail({ title, thumbnailUrl }: { title: string; thumbnailUrl: string | null }) {
  return (
    <div className="daddyTileImage">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={`${title} thumbnail`} />
      ) : (
        <div className="daddyPlaceholderTile" aria-hidden="true">
          <span className="daddyPlaceholderMark">VS</span>
          <span className="daddyPlaceholderInitial">{title.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

export default async function DaddyPage() {
  const games = await getDaddyGames();
  const playableGameIds = games.filter((game) => (game.status || "playable") === "playable").map((game) => game.id);
  const newestUploadedAt = Math.max(0, ...games.map((game) => game.uploadedAt || 0));

  return (
    <main className="daddyGamesPage">
      <header className="daddyHeader">
        <div>
          <p>Arcade Select</p>
          <h1>Daddy Games</h1>
          <span>Pick your fighter. Start the match.</span>
        </div>
        <Link className="daddyHomeLink" href="https://chang-games.vercel.app/">
          Home
        </Link>
      </header>

      <section className="daddyGamesSection" aria-labelledby="daddy-games-title">
        <div className="daddySectionHeader">
          <h2 id="daddy-games-title">All Games</h2>
          <span>{games.length} games</span>
        </div>

        <div className="daddyGameGrid">
          {games.map((game) => {
            const status = game.status || "playable";
            const isComingSoon = status === "coming-soon";
            const href = game.type === "external" ? game.playUrl : `/play/daddy/${game.id}`;

            return (
              <Link
                className={`daddyGameCard ${isComingSoon ? "isComingSoon" : ""}`}
                href={isComingSoon ? "/daddy" : href}
                key={game.id}
                aria-label={isComingSoon ? `${game.title} coming soon` : `Play ${game.title}`}
                target={game.type === "external" ? "_blank" : undefined}
                rel={game.type === "external" ? "noreferrer" : undefined}
              >
                <div className="daddyThumbWrap">
                  <DaddyThumbnail title={game.title} thumbnailUrl={game.thumbnailUrl} />
                  <span className="daddyTypeBadge">{gameTypeLabels[game.type]}</span>
                </div>
                <div className="daddyCardBody">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <GameCardStats
                    kid="daddy"
                    gameId={game.id}
                    gameIds={playableGameIds}
                    isNew={(game.uploadedAt || 0) === newestUploadedAt && newestUploadedAt > 0}
                    variant="daddy"
                  />
                  <span className="daddyPlayButton">{isComingSoon ? "Coming Soon" : "Play"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
